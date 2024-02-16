import {useEffect, useRef, useState} from "react";
import {
    BondAndTokenData,
    BondAndTokenDataWithType,
    BondCombinedData,
    BondData,
    BondInfoForIssuance
} from "@/components/pages/bonds/pages/issue/type";
import {Chain, useAccount, useNetwork, useSendTransaction, useSwitchNetwork} from "wagmi";
import InfoBox from "@/components/utils/info-box";
import {CHAINS, getChain} from "@/modules/utils/wallet-connect";
import {InfoSections} from "@/components/pages/bonds/pages/issue/constants";
import Image from "next/image";
import {shortenString} from "@/modules/utils/string";
import {formatTime} from "@/modules/utils/dates";
import {formatLargeNumber} from "@/modules/utils/numbers";
import {TokenResponse, TokensResponse} from "@/modules/cloud-api/type";
import CloudAPI from "@/modules/cloud-api";
import makeBlockie from "ethereum-blockies-base64";
import {isAddress, zeroAddress} from "viem";
import {IssuerContractInfoDetailed} from "@/modules/web3/type";
import {getIssuerContractInfo} from "@/modules/web3/zcb";
import {getTokenBalance} from "@/modules/web3/tokens";
import BigNumber from "bignumber.js";
import {polygonMumbai} from "wagmi/chains";
import VerifiedSVG from "../../../../../../public/svg/verified";
import Loading from "@/components/utils/loading";
import WarningSVG from "../../../../../../public/svg/warning";
import {BlockTimes, TxTypes} from "@/modules/web3/constants";
import {toast} from "react-toastify";
import {getContractInfoByType, trackTransaction} from "@/modules/web3";
import {openModal} from "@/store/redux/modal";
import {ModalTypes} from "@/store/redux/modal/constants";


export default function Issue() {
    const [bondInfo, setBondInfo] = useState({chainId: polygonMumbai.id} as BondInfoForIssuance);
    const [tokens, setTokens] = useState({} as TokensResponse)
    const [issuerContractInfo, setIssuerContractInfo] = useState({} as IssuerContractInfoDetailed)

    const bondInfoHandler: any = [bondInfo, setBondInfo];
    const tokensHandler: any = [tokens, setTokens];

    useEffect(() => {
        const chain = getChain(bondInfo.chainId);
        if (chain) {
            CloudAPI.getTokens({
                params: {
                    contractAddresses: [],
                    chainId: bondInfo.chainId,
                    verified: true
                }
            })
                .then((response) => {
                    if (response) setTokens(response)
                })

            getIssuerContractInfo(chain)
                .then(response => setIssuerContractInfo(response))
                .catch(error => console.log(error))
        }
    }, [bondInfo.chainId]);

    return <>
        <div className='grid grid-cols-10 gap-6 lg1:px-40 lg:px-12 md:px-12 sm:px-2 py-32'>
            <IssuerContainer bondInfoHandler={bondInfoHandler}
                             tokensHandler={tokensHandler}
                             issuerContractInfo={issuerContractInfo}/>
            <PreviewContainer bondInfoHandler={bondInfoHandler}
                              tokensHandler={tokensHandler}
                              issuerContractInfo={issuerContractInfo}/>
        </div>
    </>
}

function IssuerContainer({bondInfoHandler, tokensHandler, issuerContractInfo}: BondCombinedData) {

    const [bondInfo] = bondInfoHandler;
    const [tokens] = tokensHandler
    const network = useNetwork();
    const chain = getChain(bondInfo.chainId);
    const {switchNetworkAsync} = useSwitchNetwork();

    const config = getContractInfoByType(chain, TxTypes.IssueBond, {bondInfo, tokens, issuerContractInfo})
    const {sendTransactionAsync, data} = useSendTransaction({
        to: config.to,
        data: config.data,
        value: config.value
    })

    async function issueBonds() {
        try {
            if (!chain) return toast.error("Please select correct chain")
            if (network.chain?.id !== chain.id) await switchNetworkAsync?.(chain.id);
            if (!bondInfo.total || bondInfo.total <= 0) return toast.error("Total Bonds must be greater than 0")
            if (!Number.isFinite(bondInfo.maturityPeriod) || bondInfo.maturityPeriod <= 0) return toast.error("Maturity Period must be greater than 0")
            if (!isAddress(bondInfo.investmentToken) || !tokens[bondInfo.investmentToken]) return toast.error("Investment token is undefined")
            if (!isAddress(bondInfo.interestToken) || !tokens[bondInfo.interestToken]) return toast.error("Interest token is undefined")

            const response = await sendTransactionAsync();
            const result = await trackTransaction(chain, response.hash)
            openModal(ModalTypes.IssuedBondSuccess, {...result, chainId: chain.id})
        } catch (error: any) {

        }
    }


    return <>
        <div
            className='lg:col-span-6 sm:col-span-12 flex flex-col gap-10 rounded-3xl lg:px-12 sm:px-6 lg:py-8 md:py-6 sm:py-4 bg-neutral-950'>
            <div className='flex flex-col gap-2'>
                <h1 className='text-2xl font-bold'>Issue Your Bonds: Simple and Swift</h1>
                <p className='text-xs text-zinc-600'>Our streamlined form guides you through each step to
                    issue your bonds seamlessly. Just fill in the details - from bond type to maturity period - and
                    set the parameters that suit your financial strategy.</p>
            </div>
            <div className='h-px w-full bg-zinc-800'/>
            <IssuanceForm bondInfoHandler={bondInfoHandler} tokensHandler={tokensHandler}/>
            <div className='flex flex-col gap-2'>
                <p className='text-sm text-neutral-600'>By issuing bond you agree with our Privacy policy and Terms
                    of use.</p>
                <button className='px-2 py-3 font-medium bg-neutral-200 text-black rounded-full hover:bg-white' onClick={issueBonds}>
                    Issue Bonds
                    {
                        Boolean(issuerContractInfo.issuanceFeeUI) &&
                        <span className='text-red-500'>({issuerContractInfo.issuanceFeeUI})</span>
                    }
                </button>
            </div>
        </div>
    </>
}

function IssuanceForm({bondInfoHandler, tokensHandler}: BondAndTokenData) {
    const [bondInfo, setBondInfo] = bondInfoHandler;

    function update(event: any) {
        let {id, value, type} = event.target;

        if (type === "number") {
            value = Number(value)
        }

        setBondInfo({
            ...bondInfo,
            [id]: value
        })

    }


    return <>
        <div className='grid grid-cols-12 gap-4 mt-4'>
            <div className='col-span-4 w-full flex flex-col gap-3'>
                <InfoBox info={InfoSections.Total}><span
                    className='text-white text-md font-medium'>Total:</span></InfoBox>
                <BasicInput id='total'
                            onChange={update}
                            placeholder='Total amount of Bonds'/>
            </div>
            <MaturityPeriodSelector bondInfoHandler={bondInfoHandler}/>
            <ChainSelector bondInfoHandler={bondInfoHandler}/>
            <TokenSelector type='investmentToken' bondInfoHandler={bondInfoHandler} tokensHandler={tokensHandler}/>
            <TokenSelector type='interestToken' bondInfoHandler={bondInfoHandler} tokensHandler={tokensHandler}/>
            <div className='col-span-6 w-full flex flex-col justify-between gap-3'>
                <InfoBox info={InfoSections.InvestmentAmount}>
                    <span className='text-white text-md font-medium'>Investment Amount:</span>
                </InfoBox>
                <BasicInput id="investmentAmount"
                            placeholder='Investment amount per bond'
                            onChange={update}/>
            </div>
            <div className='col-span-6 w-full flex flex-col justify-between gap-3'>
                <InfoBox info={InfoSections.InterestAmount}>
                    <span className='text-white text-md font-medium'>Interest Amount:</span>
                </InfoBox>
                <BasicInput id="interestAmount"
                            placeholder='Interest amount per bond'
                            onChange={update}/>
            </div>
        </div>
    </>
}

function TokenSelector({type, bondInfoHandler, tokensHandler}: BondAndTokenDataWithType) {

    const isInvestment = type === 'investmentToken'
    const title = isInvestment ? "Investment Token" : "Interest Token";
    const placeholder = `${title} Contract Address`
    const infoObject = isInvestment ? InfoSections.InvestmentToken : InfoSections.InterestToken

    const {address} = useAccount();
    const [bondInfo, setBondInfo] = bondInfoHandler;
    const [tokens, setTokens] = tokensHandler;
    const [isOpen, setOpen] = useState(false);
    const inputRef = useRef<any>()
    const boxRef = useRef<any>(null)

    const tokenAddress = ((isInvestment ? bondInfo.investmentToken : bondInfo.interestToken) || "").toLowerCase();
    const tokensArray = Object.values(tokens)


    useEffect(() => {
        const handleClickOutside = (event: Event) => {
            if (boxRef.current && !boxRef.current.contains(event.target)) {
                setOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => document.removeEventListener('click', handleClickOutside)
    }, [boxRef]);


    useEffect(() => {
        const timeout = setTimeout(() => {
            if (!tokens[tokenAddress] && tokenAddress) {
                CloudAPI.getTokensDetailed({
                    chainId: bondInfo.chainId,
                    contractAddresses: [tokenAddress]
                }).then(tokensResponse => {
                    const token = tokensResponse[tokenAddress]
                    if (token) {
                        setTokens({...tokens, [tokenAddress]: token})
                    } else {
                        setTokens({...tokens, [tokenAddress]: {unidentified: true}})
                    }
                })
            }
        }, 2000)

        return () => clearTimeout(timeout)
    }, [bondInfo.chainId, tokenAddress, address]);

    const setTokenType = (contractAddress: string) => setBondInfo({
        ...bondInfo,
        [type]: (contractAddress || "").toLowerCase()
    })
    const changeInput = (event: any) => setTokenType(event.target.value)
    const openOrClose = () => setOpen(!isOpen)
    const selectToken = (contractAddress: string) => {
        setTokenType(contractAddress)
        inputRef.current.value = contractAddress;
        setOpen(false);
    }



    return <>
        <div className='relative col-span-6 w-full flex flex-col justify-between gap-3 h-full' ref={boxRef}>
            <InfoBox info={infoObject}><span className='text-white text-md font-medium'>{title}:</span></InfoBox>
            <input type='text'
                   className='bg-[#131313] rounded-md placeholder:text-[#3C3C3C] py-3 px-4 text-base'
                   placeholder={placeholder}
                   ref={inputRef}
                   onClick={openOrClose}
                   onChange={changeInput}/>
            {
                Boolean(tokensArray.length) && isOpen && <>
                    <div
                        className='absolute flex flex-col gap-1 bg-[#131313] w-full border border-w1 rounded-md top-full left-0 z-10'>
                        {tokensArray.map(token => <TokenForSelector token={token} key={token._id} onClick={selectToken}/>)}
                    </div>
                </>
            }
        </div>
    </>
}

function TokenForSelector({token, onClick}: { token: TokenResponse, onClick: any }) {

    const iconSrc = token.icon || makeBlockie(zeroAddress);

    return <>
        <div className='flex items-center gap-1 w-full cursor-pointer px-4 py-2 hover:bg-neutral-800'
             onClick={() => onClick(token.contractAddress)}>
            <Image src={iconSrc} alt={token.name} width={22} height={22}
                   className='rounded-full border border-neutral-400'/>
            <p className='text-neutral-300 text-sm'>{token.name} <span
                className='text-neutral-500'>({token.symbol})</span></p>
        </div>
    </>
}

function MaturityPeriodSelector({bondInfoHandler}: BondData) {
    const [bondInfo, setBondInfo] = bondInfoHandler;
    const Types: { [key: string]: string } = {
        Hours: "hours",
        Days: "days",
        Months: "months",
        Blocks: "blocks"
    }
    const Timers = {
        [Types.Hours]: 60 * 60,
        [Types.Days]: 24 * 60 * 60,
        [Types.Months]: 30 * 24 * 60 * 60,
        [Types.Blocks]: 1
    }

    const inputRef = useRef<any>(null);
    const boxRef = useRef<any>(null)
    const [type, setType] = useState(Types.Days)
    const [isOpen, setOpen] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event: Event) => {
            if (boxRef.current && !boxRef.current.contains(event.target)) {
                setOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => document.removeEventListener('click', handleClickOutside)
    }, [boxRef]);

    const openOrClose = () => setOpen(!isOpen)

    function updateMaturityPeriod(type: string, value: number) {
        const preValue = Timers[type] * Number(value)
        if (!BlockTimes[bondInfo.chainId]) return toast.error("Please select the chain first!")

        const maturityPeriod = type === Types.Blocks ? preValue : preValue / BlockTimes[bondInfo.chainId]
        setBondInfo({...bondInfo, maturityPeriod})
    }

    const changeType = (event: any) => {
        const type = event.target.id
        setType(type)
        updateMaturityPeriod(type, inputRef.current.value)
        openOrClose()
    }

    function changeTime(event: any) {
        const {value} = event.target;
        updateMaturityPeriod(type, value)
    }

    return <>
        <div className='md:col-span-4 sm:col-span-8 w-full flex flex-col gap-3'>
            <InfoBox info={InfoSections.MaturityPeriod}><span className='text-white text-md font-medium'>Maturity Period:</span></InfoBox>
            <div className='relative grid grid-cols-7 gap-4 rounded-md h-full bg-[#131313] text-base'>
                <input type="number"
                       id='day'
                       placeholder="Choose Maturity Period"
                       onChange={changeTime}
                       ref={inputRef}
                       className='bg-transparent col-span-4 placeholder:text-[#3C3C3C] pl-4 py-3'/>

                <div className='col-span-3 relative flex justify-center items-center cursor-pointer h-full pr-4 py-3'
                     onClick={openOrClose} ref={boxRef}>
                    <span className='text-center w-full capitalize'>{type}</span>
                </div>
                {
                    isOpen && <>
                        <div
                            className='absolute top-full right-0 bg-[#131313] flex flex-col z-10 text-sm text-center rounded-md border border-w1 '>
                            {
                                Object.keys(Types)
                                    .map(key => <><span
                                            className='px-5 py-1 cursor-pointer hover:bg-neutral-800 capitalize'
                                            id={Types[key]} onClick={changeType}>{key}</span>
                                        </>
                                    )
                            }
                        </div>
                    </>
                }
            </div>
        </div>
    </>
}

function ChainSelector({bondInfoHandler}: BondData) {
    const [bondInfo, setBondInfo] = bondInfoHandler;
    const [isOpen, setOpen] = useState(false);
    const boxRef = useRef<any>(null)

    useEffect(() => {
        const handleClickOutside = (event: Event) => {
            if (boxRef.current && !boxRef.current.contains(event.target)) {
                setOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => document.removeEventListener('click', handleClickOutside)
    }, [boxRef]);


    const openOrClose = () => setOpen(!isOpen)
    const selectChain = (chainId: number) => setBondInfo({...bondInfo, chainId})

    const chainInfo = getChain(bondInfo.chainId)

    return <>
        <div className='md:col-span-4 sm:col-span-12 w-full relative flex flex-col justify-center gap-3' ref={boxRef}>
            <InfoBox info={InfoSections.Chain}><span className='text-white text-md font-medium'>Chain:</span></InfoBox>

            <div
                className='flex justify-start items-center bg-[#131313] rounded-md px-4 py-2 cursor-pointer h-full'
                onClick={openOrClose}>
                <div className='flex gap-2 items-center'>
                    <Image src={`/svg/chains/${chainInfo?.id}.svg`} alt={chainInfo?.name || ""}
                                   width={24}
                                   height={24}/>
                    <span className='text-sm font-medium'>{shortenString(chainInfo?.name || "", 15)}</span>
                </div>
                <div
                    className={`${isOpen ? "flex" : "hidden"} absolute flex-col bg-[#131313] border border-w1 rounded-md left-0 top-full z-10 w-full`}>
                    {CHAINS.map(chain => <ChainContainer chain={chain} selectChain={selectChain} key={chain.id}/>)}
                </div>
            </div>
        </div>
    </>
}

function ChainContainer({chain, selectChain}: { chain: Chain, selectChain: any }) {
    return <>
        <div className='flex gap-2 items-center w-full hover:bg-neutral-800 px-3 py-2'
             onClick={() => selectChain(chain.id)}>
            <Image src={`/svg/chains/${chain.id}.svg`} alt={chain.name} width={24} height={24}/>
            <span
                className='text-sm font-medium min-w-full'>{shortenString(chain.name || "", 20)}</span>
        </div>
    </>
}


function PreviewContainer({bondInfoHandler, tokensHandler, issuerContractInfo}: BondCombinedData) {
    return <>
        <div
            className='lg:col-span-4 sm:col-span-12 flex flex-col gap-8 rounded-3xl md:px-12 sm:px-6 py-8 bg-neutral-950'>
            <div className='flex flex-col gap-2'>
                <h2 className='text-2xl font-bold'>Preview Your Bonds</h2>
                <p className='text-xs text-zinc-600'>This real-time snapshot allows you to review and
                    fine-tune every aspect of your bonds before finalizing.</p>
            </div>
            <div className='h-px w-full bg-zinc-800'/>
            <Preview bondInfoHandler={bondInfoHandler}
                     tokensHandler={tokensHandler}
                     issuerContractInfo={issuerContractInfo}/>
        </div>
    </>
}

function Preview({bondInfoHandler, tokensHandler, issuerContractInfo}: BondCombinedData) {

    const [bondInfo, setBondInfo] = bondInfoHandler;
    const [tokens, setTokens] = tokensHandler;

    const chainInfo = getChain(bondInfo.chainId)

    const maturityPeriodTime = (BlockTimes[bondInfo.chainId] * bondInfo.maturityPeriod) || 0
    const maturityPeriodStr = formatTime(maturityPeriodTime, true)

    return <>
        <div className='grid grid-cols-12 mt-4 gap-4'>
            {
                Number.isFinite(bondInfo.total) && <>
                    <div className='col-span-4 w-full flex flex-col items-center gap-0.5 cursor-pointer'
                         title={bondInfo.total.toString()}>
                        <span className='text-2xl font-medium'>{formatLargeNumber(bondInfo.total)}</span>
                        <span className='text-neutral-500 text-xs'>Total</span>
                    </div>
                </>
            }
            {
                Number.isFinite(bondInfo.maturityPeriod) && bondInfo.maturityPeriod > 0 && <>
                    <div className='col-span-4 w-full flex flex-col items-center gap-0.5 cursor-pointer'
                         title={maturityPeriodStr}>
                        <span
                            className='text-2xl whitespace-nowrap font-medium'>{shortenString(maturityPeriodStr, 9)}</span>
                        <span className='text-neutral-500 text-xs'>Maturity Period</span>
                    </div>
                </>
            }
            {
                Number.isFinite(bondInfo.chainId) && <>
                    <div className='col-span-4 w-full flex flex-col items-center gap-0.5 cursor-pointer'>
                        <div className='flex gap-2 items-center texee'>
                            <Image src={`/svg/chains/${chainInfo?.id}.svg`} alt={chainInfo?.name || ""} width={24}
                                   height={24}/>
                            <span className='text-2xl font-medium'>{shortenString(chainInfo?.name || "", 5)}</span>
                        </div>
                        <span className='text-neutral-500 text-xs'>Chain</span>
                    </div>
                </>
            }
            {
                Boolean(bondInfo.investmentToken) &&
                <TokenPreview
                    type='investmentToken'
                    token={tokens[bondInfo.investmentToken]}
                    issuerContractInfo={issuerContractInfo}
                    bondInfo={bondInfo}/>
            }
            {
                Boolean(bondInfo.interestToken) &&
                <TokenPreview type='interestToken'
                              token={tokens[bondInfo.interestToken]}
                              issuerContractInfo={issuerContractInfo}
                              bondInfo={bondInfo}/>
            }
        </div>
    </>
}


function TokenPreview({type, token, bondInfo, issuerContractInfo}: {
    type: string,
    token: TokenResponse,
    bondInfo: BondInfoForIssuance,
    issuerContractInfo: IssuerContractInfoDetailed
}) {

    const {address} = useAccount();
    const chain = getChain(bondInfo.chainId)
    const isInvestment = type === "investmentToken";
    const tokenAddress = isInvestment ? bondInfo.investmentToken : bondInfo.interestToken;
    const [balance, setBalance] = useState({
        value: 0,
        isLoading: false
    });

    useEffect(() => {
        if (chain && address && token) {
            setBalance({
                value: 0,
                isLoading: true
            });

            const interval = setInterval(() => {
                getTokenBalance(chain, tokenAddress, address)
                    .then(response => {
                        const balanceClean = BigNumber(response).div(BigNumber(10).pow(token.decimals));
                        setBalance({
                            value: balanceClean.toNumber(),
                            isLoading: false
                        });
                    })
                    .catch(error => {
                        console.error(`getTokenBalance`, error.message)
                        setBalance({
                            value: 0,
                            isLoading: false
                        });
                    })
            }, 10000)
            return () => clearInterval(interval)
        }
    }, [chain, address, token, tokenAddress]);

    const title = isInvestment ? "Investment" : "Interest";
    const amountTitle = isInvestment ? "Total Received" : "Total Returned"

    if (!token) {
        if (isAddress(tokenAddress)) return <TokenContainer><Loading/></TokenContainer>
        else if (!isAddress(tokenAddress)) return <UnidentifiedToken chain={chain}/>
        else return null
    }

    if (token.unidentified) {
        return <UnidentifiedToken chain={chain}/>
    }

    const iconSrc = token.icon || makeBlockie(zeroAddress);
    const total = bondInfo.total * (isInvestment ? bondInfo.investmentAmount : bondInfo.interestAmount) || 0;

    return <>
        <TokenContainer>
            <span className='text-xl font-medium'>{title}:</span>
            <div className='flex items-center gap-4'>
                <Image src={iconSrc} alt={token.name} width={32} height={32}
                       className='object-contain rounded-full border border-neutral-400'/>
                <div className='flex flex-col gap-1'>
                    <div className='flex items-center gap-2'>
                        <p className='text-sm'>{token.name} <span>({token.symbol})</span></p>
                        {token.isVerified && <VerifiedSVG/>}
                    </div>
                    <span className='text-xs text-neutral-400'>
                        Balance: {balance.isLoading ? <Loading percent={85}/> : balance.value + token.symbol}</span>
                </div>
            </div>
            {
                Boolean(total) && <>
                    <div className='h-px bg-neutral-900 w-full'/>
                    <div className='flex flex-col'>
                        <p>{amountTitle}: <span
                            className={`${isInvestment ? "text-green-500" : "text-red-500"} font-bold`}>{total} {token.symbol}</span>
                        </p>
                        {isInvestment &&
                            <span className='text-neutral-500 text-xs'>We charge {issuerContractInfo.purchaseFeePercentage}% on every purchased bond.</span>}
                    </div>
                </>
            }
        </TokenContainer>
    </>
}

function TokenContainer({children}: { children?: any }) {
    return <>
        <div
            className='col-span-12 w-full flex flex-col gap-2 cursor-pointer bg-neutral-900 rounded-xl px-4 py-2'>{children}</div>
    </>
}

function UnidentifiedToken({chain}: { chain?: Chain }) {
    return <TokenContainer>
        <div className='flex justify-start gap-1 cursor-pointer'>
            <p className='text-sm'>
                Could not identify the token, make sure the contract is correct for
                <span className="text-red-500 font-bold"> {chain?.name} network</span>
            </p>
            <WarningSVG/>
        </div>
    </TokenContainer>
}


function BasicInput({id, type, className, onChange, onClick, ref, placeholder}: {
    id?: string,
    type?: string,
    className?: string,
    onChange?: any,
    placeholder?: string,
    onClick?: any,
    ref?: any,
}) {
    return <>
        <input id={id}
               type={"number" || type}
               className={'bg-[#131313] rounded-md placeholder:text-[#3C3C3C] py-3 px-4 text-base ' + className}
               onClick={onClick}
               ref={ref}
               placeholder={placeholder}
               onChange={onChange}/>
    </>
}
