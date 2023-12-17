import {useAccount, useNetwork, useSendTransaction, useSwitchNetwork} from "wagmi";
import {useEffect, useRef, useState} from "react";
import {requestAPI} from "@/modules/cloud-api/util";
import Loading from "@/components/utils/loading";
import {TokenResponse} from "@/modules/cloud-api/type";
import {divBigNumberForUI, format, mulBigNumber} from "@/modules/utils/numbers";
import Image from "next/image";
import {getContractInfoByType, trackTransaction} from "@/modules/web3";
import {bsc, polygon, polygonZkEvm} from "wagmi/chains";
import makeBlockie from "ethereum-blockies-base64";
import CloudAPI from "@/modules/cloud-api";
import Link from "next/link";
import XmarkSVG from "../../../../public/svg/xmark";
import {useWeb3Modal} from "@web3modal/wagmi/react";
import RefreshSVG from "../../../../public/svg/utils/refresh";
import SettingsSVG from "../../../../public/svg/utils/settings";
import {toast} from "react-toastify";
import {TxTypes, ZERO_ADDRESS} from "@/modules/web3/constants";
import {Result, TokenSelectorComponent} from "@/components/pages/swap/type";
import InfoBox from "@/components/utils/info-box";
import {URLS} from "@/modules/utils/urls";
import {getAllowance} from "@/modules/web3/tokens";
import {nop} from "@/modules/utils/function";
import SwapSVG from "../../../../public/svg/utils/swap";
import {toBN} from "@/modules/web3/util";
import {useSelector} from "react-redux";
import {RootState} from "@/store/redux/type";
import {getChain} from "@/modules/utils/wallet-connect";

const nativeTokenContract = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'


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
    [polygonZkEvm.id]: "polygon-zkevm",
    [polygon.id]: 'polygon',
    [bsc.id]: 'bsc',
    // [mainnet.id]: 'ethereum',
    // [arbitrum.id]: 'arbitrum',
    // [scroll.id]: 'scroll'
}

const LOCAL_KYBER_CONFIG = 'kyberswap-config'

export default function Swap() {
    const generalState = useSelector((item: RootState) => item.general);
    const chain = getChain(generalState.chainId);

    const network = useNetwork();
    const {switchNetworkAsync} = useSwitchNetwork({
        chainId: chain?.id
    });

    const {address} = useAccount();
    const {open} = useWeb3Modal()


    const [isSupported, setSupported] = useState(true);
    const [isLoading, setLoading] = useState(false);
    const [refresh, setRefresh] = useState(0);

    const [settings, setSettings] = useState({
        isOpen: false,
        slippageTolerance: 50,
        saveGas: false
    });

    const [tokenSelector, setTokenSelector] = useState("");
    const [tokens, setTokens] = useState<TokenResponse[]>([])

    const [allowance, setAllowance] = useState("0");

    const [from, setFrom] = useState({amount: 0} as { amount: number, token?: TokenResponse })
    const [to, setTo] = useState({} as { token?: TokenResponse })
    const [result, setResult] = useState({} as Result)

    const amountIn = mulBigNumber(from.amount, from.token?.decimals).toString();
    const chainName = chainsByRouterNames[chain?.id || ""];
    const isApprove = (from.amount && from.token && to.token && from.token._id !== nativeTokenContract) && toBN(allowance).lt(toBN(amountIn));

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

    function refreshPrices() {
        if (from.token?._id && to.token?._id && amountIn) {
            setRefresh(Math.random())
        } else {
            toast.error(`Please select the tokens and type the amount.`)
        }
    }

    function openOrCloseSettings() {
        setSettings({...settings, isOpen: !settings.isOpen});
    }

    function swapCurrencies() {
        setResult({} as any);
        setFrom({
            ...from,
            token: to.token
        });
        setTo({
            ...to,
            token: from.token
        });
        refreshPrices();
    }

    useEffect(() => {
        if (typeof localStorage !== "undefined") {
            const result = localStorage.getItem(LOCAL_KYBER_CONFIG)
            const parsed = JSON.parse(result || "{}")
            setSettings({
                ...settings,
                ...parsed
            })
        }
    }, []);

    useEffect(() => {
        setFrom({amount: from.amount});
        setTo({});
        setResult({} as any);
    }, [chain]);

    useEffect(() => {
        if (chain?.id && chainName) {
            const params = {
                chainId: chain?.id,
                contractAddresses: [],
                verified: true
            }

            const nativeToken = {
                _id: nativeTokenContract,
                name: chain.nativeCurrency.name,
                symbol: chain.nativeCurrency.symbol,
                decimals: chain.nativeCurrency.decimals,
                isVerified: true,
                icon: `/svg/chains/${chain.id}.svg`
            }

            CloudAPI.getTokens({params})
                .then(response => {
                    if (response) {
                        setTokens([nativeToken, ...Object.values(response)])
                    }
                })


            const interval = setInterval(() => {
                CloudAPI.getTokens({params}).then(response => {
                    if (response) {
                        setTokens([nativeToken, ...Object.values(response)])
                    }
                })
            }, 20000)

            return () => clearInterval(interval)
        }
    }, [chain]);

    useEffect(() => { // check allowance
        if (chain && from.token?._id && address) {

            if (from.token._id === nativeTokenContract) {
                setAllowance("1000000000000")
            } else {
                getAllowance(chain, from.token?._id, address, result.routerAddress)
                    .then(allowanceResponse => {
                        setAllowance(allowanceResponse.toString())
                    })
                    .catch(nop)
            }
        }
    }, [chain, address, from, result.routerAddress, refresh]);

    useEffect(() => {
        const getTokenPrices = () => {
            requestAPI({
                url: `https://aggregator-api.kyberswap.com/${chainName}/route/encode`,
                params: {
                    tokenIn: from.token?._id,
                    tokenOut: to.token?._id,
                    amountIn,
                    to: address || ZERO_ADDRESS,
                    slippageTolerance: settings.slippageTolerance,
                    saveGas: settings.saveGas,
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

        setResult({} as any);
        if (amountIn) setLoading(true);

        if (!chainName) {
            setSupported(false);
            setLoading(false);
        } else {
            setSupported(true)

            if (from.token?._id && to.token?._id && amountIn) {
                getTokenPrices();
                const interval = setInterval(getTokenPrices, 5000)

                return () => clearInterval(interval)
            } else {
                setLoading(false)
            }
        }
    }, [from.token?._id, to.token?._id, amountIn, address, chain?.id, refresh]);

    const output = divBigNumberForUI(result.outputAmount, to.token?.decimals || 18);
    const isBlur = Boolean(tokenSelector) || Boolean(settings.isOpen);

    const config: any = isApprove ? getContractInfoByType(chain, TxTypes.ApproveToken, {
            contractAddress: from.token?._id,
            spender: result.routerAddress,
            value: mulBigNumber(from.amount, from.token?.decimals, true)
        })
        :
        {
            to: result.routerAddress,
            value: BigInt(from?.token?._id === nativeTokenContract ? amountIn : 0) || 0,
            data: result.encodedSwapData as any,
            chainId: chain?.id
        }
    const transaction = useSendTransaction(config)

    async function swap() {
        try {
            if (!address) {
                return open();
            }

            if (!result.encodedSwapData) {
                return toast.error("Please select the token")
            }

            if (network.chain?.id !== chain?.id) {
                await switchNetworkAsync?.();
            }


            const response = await transaction.sendTransactionAsync();
            await trackTransaction(chain, response.hash);
            refreshPrices()
        } catch (error: any) {
            console.log(error.message)
        }
    }

    if (!isSupported) {
        return <NotSupportedChain/>
    }

    return <>
        <div className='flex items-center justify-center w-full min-h-[80vh]'>
            <div className='relative flex flex-col gap-2 w-[500px] rounded-2xl bg-b5 p-5'>
                <div className={'flex flex-col gap-2 w-full rounded-2xl' + (isBlur && " blur-sm")}>
                    <div className='flex justify-between items-center'>
                        <span className='text-xl'>Swap</span>
                        <div className='flex gap-2 items-center'>
                            <RefreshSVG onClick={refreshPrices} isLoading={isLoading}/>
                            <SettingsSVG onClick={openOrCloseSettings}/>
                        </div>
                    </div>

                    <InputComponent>
                        <span className='text-g3'>You Pay</span>
                        <div className='flex justify-between items-start'>
                            <div className='flex flex-col gap-0.5'>
                                <input type="number"
                                       placeholder='0'
                                       className='bg-transparent rounded w-full text-lg'
                                       id='fromAmount'
                                       onChange={onChange}
                                       autoFocus/>
                                <span className='text-g2 text-sm'>~${format(result.amountInUsd || 0)}</span>
                            </div>
                            <TokenComponent token={from.token}
                                            type='from'
                                            tokenSelectorHandler={[tokenSelector, setTokenSelector]}/>
                        </div>
                    </InputComponent>

                    <InputComponent>
                        <div className='absolute top-[-20%] left-[45%] cursor-pointer'>
                            <SwapSVG onClick={swapCurrencies}/>
                        </div>
                        <span className='text-g3'>You Receive</span>
                        <div className='flex justify-between items-start'>
                            {
                                isLoading ?
                                    <Loading percent={25.8}/> : <>
                                        <div className='flex flex-col gap-0.5 cursor-not-allowed'>
                                            <span>{format(output)}</span>
                                            <span className='text-g2 text-sm'>~${format(result?.receivedUsd || 0)}</span>
                                        </div>
                                    </>
                            }
                            <TokenComponent token={to.token}
                                            type='to'
                                            tokenSelectorHandler={[tokenSelector, setTokenSelector]}/>
                        </div>
                    </InputComponent>

                    <div className='flex flex-col items-center gap-2 mt-4'>
                        <button
                            className='flex gap-2 items-center  justify-center w-full bg-g3  text-white rounded p-2'
                            onClick={swap}>
                            {transaction.isLoading && <Loading percent={70}/>}
                            {isApprove ? "Approve" : "Swap"}
                        </button>
                        <span className='text-sm'>Powered by <Link
                            href="https://kyberswap.com/" target="_blank"
                            rel="noreferrer" className='text-kyberswap'>KyberSwap</Link></span>
                    </div>
                </div>
                {
                    Boolean(tokenSelector) && <TokenSelector
                        tokenSelectorHandler={[tokenSelector, setTokenSelector]}
                        tokens={tokens}
                        fromHandler={[from, setFrom]}
                        toHandler={[to, setTo]}/>
                }
                {Boolean(settings.isOpen) && <Settings settingsHandler={[settings, setSettings, openOrCloseSettings]}/>}
            </div>
        </div>
    </>
}

function InputComponent({children}: any) {
    return <>
        <div className='relative flex flex-col gap-2 px-6 py-3 border border-w6 rounded-2xl bg-g6'>
            {children}
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
    const icon = token?.icon || makeBlockie(token?._id || ZERO_ADDRESS)

    return <>
        <div
            className='flex items-center gap-2 border border-solid border-w1 rounded bg-b6 p-1 px-2 cursor-pointer min-w-[120px]'
            onClick={openTokenSelector}>
            {
                !token ?
                    <>
                        <span className='text-center w-full'>Select</span>
                    </> : <>
                        <Image src={icon} alt={token.name} width={24} height={24}/>
                        <span>{token?.symbol}</span>
                    </>
            }
        </div>
    </>
}

function TokenSelector({tokenSelectorHandler, tokens, fromHandler, toHandler}: TokenSelectorComponent) {

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
                setFilteredTokens(newFilter);
            }, 100);

            return () => clearInterval(interval);
        }
    }, [searchText]);

    if (!Boolean(tokenSelector)) { // todo add the token search by contract address as well
        return null;
    }

    const [from, setFrom] = fromHandler;
    const [to, setTo] = toHandler;

    function selectToken(token: TokenResponse) {
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

    function Token({token}: { token: TokenResponse }) {

        return <>
            <div
                className='flex items-center gap-2 bg-b1 p-2 rounded hover:bg-b2 cursor-pointer'
                onClick={() => selectToken(token)}>
                <Image src={token.icon || makeBlockie(token._id)} alt={token.name}
                       width={24} height={24} className='rounded-full'/>
                <p className='gap-1'>{token.name}<span
                    className='text-g'>({token.symbol})</span></p>
            </div>
        </>
    }

    return <>
        <div className='absolute flex justify-center items-center w-full h-full top-0 left-0 right-0 ml-auto mr-auto'>
            <div
                className='flex flex-col justify-center gap-4  md:w-[80%] sm:w-[95%] border border-w1 rounded-2xl  bg-b4 p-8 py-4 '>
                <div className='flex justify-between items-center'>
                    <span className='text-xl'>Select:</span>
                    <XmarkSVG isMedium onClick={() => setTokenSelector("")}/>
                </div>
                <div className='flex flex-col overflow-x-auto max-h-96 gap-2'>
                    <input type="text" className='bg-transparent border border-w1 rounded px-3 py-1.5 text-sm'
                           placeholder='Search by symbol or contract address'
                           ref={inputRef}
                           onChange={(event) => setSearchText(event.target.value)}/>

                    {filteredTokens.map(token => <Token token={token} key={token._id}/>)}
                </div>
            </div>
        </div>
    </>
}


function NotSupportedChain() {

    return <>
        <div className='flex justify-center items-center min-h-[80vh]'>
            <div className='flex flex-col items-center w-full'>
                <div className='flex flex-col items-center gap-2 p-4 bg-b4 rounded'>
                    <p className='text-xl font-medium'>Swap is not supported</p>
                    <span
                        className='text-g text-sm'>Sorry, Please switch the chain to use the swap widget</span>
                </div>
            </div>
        </div>
    </>
}

function Settings({settingsHandler}: { settingsHandler: any[] }) {
    const [settings, setSettings, openOrCloseSettings] = settingsHandler;
    const slippageTolerancePercent = settings.slippageTolerance / 100

    function changeSwapSettings(key: string, value: any) {

        setSettings({
            ...settings,
            [key]: value
        })

        const result = localStorage.getItem(LOCAL_KYBER_CONFIG);
        const parsed = JSON.parse(result || "{}");
        localStorage.setItem(LOCAL_KYBER_CONFIG, JSON.stringify({
            ...parsed,
            [key]: value
        }))
    }

    const changeSlippage = (event: any) => {

        const slippageTolerance = Number(event.target.value || 0) * 100;
        if (slippageTolerance > 2000) {
            return toast.error("Exceeded Max Slippage Tolerance")
        }

        if (slippageTolerance < 0) {
            return toast.error("Exceeded Min Slippage Tolerance")
        }
        setSettings({...settings, slippageTolerance})
        changeSwapSettings("slippageTolerance", slippageTolerance)
    }

    return <>
        <div className='absolute flex justify-center items-center w-full h-full top-0 left-0 right-0 ml-auto mr-auto'>
            <div
                className='flex flex-col justify-center gap-4  md:w-[80%] sm:w-[95%] border border-w1 rounded-2xl  bg-b4 p-6 py-3 '>
                <div className='flex justify-between items-center'>
                    <span className='text-xl'>Settings:</span>
                    <XmarkSVG isMedium onClick={openOrCloseSettings}/>
                </div>
                <div className='flex flex-col overflow-x-auto gap-10 px-2'>

                    <div className='flex flex-col gap-2'>
                        <div className='flex justify-between items-center'>
                            <InfoBox
                                info={{text: "During your swap if the price changes by more than this %, your transaction will revert."}}>
                                <span className='whitespace-nowrap'>Slippage Tolerance</span>
                            </InfoBox>
                            <div className='flex border border-w1 rounded px-2 justify-end'>
                                <input type="number" className='bg-transparent max-w-[50px] text-sm'
                                       defaultValue={slippageTolerancePercent} onChange={changeSlippage}/>
                                <span>%</span>
                            </div>
                        </div>

                        <div className='flex justify-between items-center'>
                            <InfoBox
                                info={{text: "If toggled, route will be based on the lowest gas cost"}}>
                                <span className='whitespace-nowrap'>Save Gas</span>
                            </InfoBox>
                            <div
                                className={'flex w-14 rounded-full cursor-pointer p-0.5 ' + (settings.saveGas ? "bg-green-500 justify-end" : "bg-neutral-800 justify-start")}
                                onClick={() => changeSwapSettings("saveGas", !settings.saveGas)}>
                                <div className='bg-white py-3 px-3 rounded-full'/>
                            </div>
                        </div>
                    </div>

                    <p className='text-g text-sm'>Learn more about the settings
                        <Link href={URLS.others.KyberSwapSettingsFAQ} target="_blank"
                              rel="noreferrer"><span className='text-kyberswap'> here.</span></Link></p>
                </div>
            </div>
        </div>
    </>
}
