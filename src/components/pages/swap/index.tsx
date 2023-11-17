import {useAccount, useNetwork, useSendTransaction} from "wagmi";
import {useEffect, useRef, useState} from "react";
import {requestAPI} from "@/modules/cloud-api/util";
import Loading from "@/components/utils/loading";
import {TokenResponse} from "@/modules/cloud-api/type";
import {divBigNumber, format, mulBigNumber} from "@/modules/utils/numbers";
import Image from "next/image";
import {trackTransaction} from "@/modules/web3";
import {arbitrum, bsc, mainnet, polygon, scroll} from "wagmi/chains";
import makeBlockie from "ethereum-blockies-base64";
import CloudAPI from "@/modules/cloud-api";
import Link from "next/link";
import XmarkSVG from "../../../../public/svg/xmark";
import {useWeb3Modal} from "@web3modal/wagmi/react";

type Result = {
    "inputAmount": string,
    "outputAmount": string,
    "totalGas": number,
    "gasPriceGwei": string,
    "gasUsd": number,
    "amountInUsd": number,
    "amountOutUsd": number,
    "receivedUsd": number,
    "swaps": any[]
    "tokens": {
        [contractAddress: string]: {
            "address": string,
            "symbol": string,
            "name": string,
            "price": number,
            "decimals": number
        }
    },
    "encodedSwapData": string,
    "routerAddress": string
}

// Optimism (ChainID: 10) -> optimism
// Avalanche (ChainID: 43114) -> avalanche
// Base (ChainID: 8453) -> base
// Cronos (ChainID: 25) -> cronos
// zkSync Era (ChainID: 324) -> zksync
// Fantom (ChainID: 250) -> fantom
// Linea (ChainID: 59144) -> linea
// Polygon zkEVM (ChainID: 1101) -> polygon-zkevm
// Aurora (ChainID: 1313161554) -> aurora
// BitTorrent Chain (ChainID: 199) -> bittorrent

const chainsByRouterNames: { [key: string]: string } = {
    [mainnet.id]: 'ethereum',
    [bsc.id]: 'bsc',
    [arbitrum.id]: 'arbitrum',
    [polygon.id]: 'polygon',
    [scroll.id]: 'scroll'
}

export default function Swap() {
    const {chain} = useNetwork();
    const {address} = useAccount();
    const {open} = useWeb3Modal()


    const [isSupported, setSupported] = useState(true);
    const [isLoading, setLoading] = useState(false);

    const [tokenSelector, setTokenSelector] = useState("");
    const [tokens, setTokens] = useState<TokenResponse[]>([])

    const [from, setFrom] = useState({
        amount: 0,
    } as { amount: number, token?: TokenResponse })
    const [to, setTo] = useState({} as { token?: TokenResponse })
    const [result, setResult] = useState({} as Result)

    const amountIn = mulBigNumber(from.amount, from.token?.decimals).toString();
    const chainName = chainsByRouterNames[chain?.id || ""];

    function onChange(event: any) {
        const {id, value} = event.target;
        if (id.startsWith('from')) {
            if (id.endsWith('Amount')) {
                setFrom({
                    ...from,
                    amount: Number(value) || 0
                })
            } else {

            }

        } else {
            if (id.endsWith('Amount')) {

            } else {

            }
        }

    }

    useEffect(() => {

        setFrom({amount: from.amount});
        setTo({});
        setResult({} as any);

    }, [chain]);

    useEffect(() => {
        if (chain?.id) {
            const params = {
                chainId: chain?.id,
                contractAddresses: [],
                verified: true
            }
            CloudAPI.getTokens({params}).then(response => {
                if (response) {
                    setTokens(Object.values(response))
                }
            })


            const interval = setInterval(() => {
                CloudAPI.getTokens({params}).then(response => {
                    if (response) {
                        setTokens(Object.values(response))
                    }
                })
            }, 10000)

            return () => clearInterval(interval)
        }
    }, [chain]);

    useEffect(() => {

        if (amountIn) setLoading(true);

        if (!chainName) {
            setSupported(false);
            setLoading(false);
        } else {
            setSupported(true)

            if (from.token?._id && to.token?._id) {
                const interval = setInterval(() => {
                    if (amountIn) {
                        requestAPI({
                            url: `https://aggregator-api.kyberswap.com/${chainName}/route/encode`,
                            params: {
                                tokenIn: from.token?._id,
                                tokenOut: to.token?._id,
                                amountIn,
                                to: address,
                                source: "amet"
                            },
                            headers: {
                                "Accept-Version": "Latest",
                                "x-client-ID": "amet"
                            }
                        }).then(data => {
                            if (data) {
                                setResult(data);
                            }
                            setLoading(false)
                        })
                    }
                }, 2000)

                return () => clearInterval(interval)
            } else {
                setLoading(false)
            }
        }
    }, [from.token?._id, to.token?._id, amountIn, address, chain?.id]);

    const output = divBigNumber(result.outputAmount, to.token?.decimals).toNumber();
    const pricePerToken = format((output / from.amount) || 0)

    const {sendTransactionAsync} = useSendTransaction({
        to: result.routerAddress,
        data: result.encodedSwapData as any,
    })

    async function swap() {
        try {
            if (!address) {
                return open();
            }

            const response = await sendTransactionAsync();
            await trackTransaction(chain, response.hash)
        } catch (error: any) {
            console.log(error.message)
        }
    }

    if (!address) {
        return <ConnectWallet/>
    }

    if (!isSupported) {
        return <NotSupportedChain/>
    }

    return <>
        <div className='flex items-center justify-center w-full min-h-[80vh]'>
            <div className='relative flex flex-col gap-2 w-40 border border-w1 min-w-500 rounded-2xl'>
                <div className='flex flex-col gap-2 px-4 py-5'>
                    <div className='flex justify-between items-center gap-10 w-full'>
                        <span className='text-xl'>You Pay</span>
                    </div>
                    <div className='flex justify-between items-start'>
                        <div className='flex flex-col gap-2'>
                            <input type="number" placeholder='The amount to swap'
                                   className='bg-transparent rounded w-full text-lg'
                                   id='fromAmount'
                                   onChange={onChange}
                                   autoFocus/>
                            <span className='text-g2'>~${result.amountInUsd || 0}</span>
                        </div>
                        <TokenComponent token={from.token}
                                        type='from'
                                        tokenSelectorHandler={[tokenSelector, setTokenSelector]}/>
                    </div>
                </div>
                <div className='flex flex-col gap-2 bg-b2 px-2 py-5 pb-2 m-2 rounded'>
                    <span className='text-xl'>You Receive</span>
                    <div className='flex justify-between items-start'>
                        {
                            isLoading ?
                                <Loading percent={20}/> : <>
                                    <div className='flex flex-col'>
                                        <span>{format(output)}</span>
                                        <span className='text-g2'>~${format(result?.receivedUsd || 0)}</span>
                                    </div>
                                </>
                        }
                        <TokenComponent token={to.token}
                                        type='to'
                                        tokenSelectorHandler={[tokenSelector, setTokenSelector]}/>
                    </div>
                    <div className="h-px w-full bg-g5"/>
                    {
                        isLoading ?
                            <Loading percent={60}/> :
                            <span>1 {from.token?.symbol} = {pricePerToken} {to.token?.symbol}</span>
                    }
                    <div className='flex flex-col items-center gap-2'>
                        <button
                            className='w-full bg-white  text-black rounded p-2 hover:bg-black hover:text-white'
                            onClick={swap}>Swap
                        </button>
                        <span className='text-xs'>Powered by <Link
                            href={`https://kyberswap.com/swap/${chainName}`} target="_blank"
                            rel="noreferrer">KyberSwap</Link></span>
                    </div>
                </div>
                {
                    Boolean(tokenSelector) && <TokenSelector
                        tokenSelectorHandler={[tokenSelector, setTokenSelector]}
                        tokens={tokens}
                        fromHandler={[from, setFrom]}
                        toHandler={[to, setTo]}/>
                }
            </div>
        </div>
    </>
}

function TokenComponent({token, type, tokenSelectorHandler}: {
    token?: TokenResponse,
    type: string,
    tokenSelectorHandler: any
}) {
    const [tokenSelector, setTokenSelector] = tokenSelectorHandler;
    const openTokenSelector = () => setTokenSelector(type)
    if (!token) {
        return <div
            className='flex items-center justify-center gap-2 border border-solid border-w1 p-2 rounded bg-b2 cursor-pointer min-w-[120px] text-center'
            onClick={openTokenSelector}>
            <span>Select</span>
        </div>
    }

    const icon = token.icon || makeBlockie(token._id)

    return <>
        <div
            className='flex items-center gap-2 border border-solid border-w1 p-2 rounded bg-b2 cursor-pointer min-w-[120px]'
            onClick={openTokenSelector}>
            <Image src={icon} alt={token.name} width={32} height={32}/>
            <span>{token?.symbol}</span>
        </div>
    </>
}

function TokenSelector({tokenSelectorHandler, tokens, fromHandler, toHandler}: {
    tokenSelectorHandler: any,
    tokens: TokenResponse[],
    fromHandler: any,
    toHandler: any
}) {

    const [tokenSelector, setTokenSelector] = tokenSelectorHandler;
    const [searchText, setSearchText] = useState("");
    const [filteredTokens, setFilteredTokens] = useState(tokens);
    const inputRef = useRef<any>()

    useEffect(() => {
        inputRef?.current?.focus()
    }, []);

    useEffect(() => {

        if (!searchText) {
            setFilteredTokens(tokens)
        } else {
            const interval = setInterval(() => {
                const newFilter = tokens.filter(item => {
                    const regex = new RegExp(searchText, 'i')
                    return regex.test(item.name) || regex.test(item.symbol) || regex.test(item._id)
                })
                console.log('running job')
                setFilteredTokens(newFilter);
            }, 100);

            return () => clearInterval(interval);
        }
    }, [searchText]);

    if (!Boolean(tokenSelector)) {
        return null;
    }

    const [from, setFrom] = fromHandler;
    const [to, setTo] = toHandler;

    return <>
        <div className='absolute flex flex-col gap-4 w-full h-full bg-b4 rounded p-4'>
            <div className='flex justify-between items-center'>
                <span className='text-xl'>Select tokens from the list:</span>
                <XmarkSVG isMedium onClick={() => setTokenSelector("")}/>
            </div>
            <div className='flex flex-col overflow-x-auto gap-2'>
                <input type="text" className='bg-transparent border border-w1 rounded px-2 py-1'
                       placeholder='Search by symbol or contract address'
                       ref={inputRef}
                       onChange={(event) => setSearchText(event.target.value)}/>
                {filteredTokens.map(token => {

                    const selectToken = () => {
                        if (tokenSelector === 'from') {
                            setFrom({
                                ...from,
                                token
                            })
                        } else {
                            setTo({
                                token
                            })
                        }
                        setTokenSelector("");
                    }

                    return <>
                        <div
                            className='flex items-center gap-2 bg-b3 p-2 rounded hover:bg-b2 cursor-pointer'
                            onClick={selectToken}>
                            <Image src={token.icon || makeBlockie(token._id)} alt={token.name}
                                   width={32} height={32} className='rounded-full'/>
                            <p className='gap-1'>{token.name}<span
                                className='text-g'>({token.symbol})</span></p>
                        </div>
                    </>
                })}
            </div>
        </div>
    </>
}


function NotSupportedChain() {

    const {chain} = useNetwork();

    return <>
        <div className='flex flex-col items-center w-full'>
            <div className='flex flex-col items-center gap-2 p-4 bg-b4 rounded'>
                <p className='text-xl font-medium'><span
                    className='text-red-500'>{chain?.name}</span> swap is not supported</p>
                <span
                    className='text-g text-sm'>Sorry, Please switch the chain to use the swap widget</span>
            </div>
        </div>
    </>
}

function ConnectWallet() {
    const {open} = useWeb3Modal();

    return <>
        <div className='flex flex-col items-center w-full'>
            <div className='flex flex-col items-center gap-4 p-4 bg-b4 rounded'>
                <p className='text-xl font-medium'>Start by connecting you wallet</p>
                <button className='w-full p-2 border border-w1 rounded hover:text-black hover:bg-white'
                        onClick={() => open()}>Connect
                </button>
            </div>
        </div>
    </>
}
