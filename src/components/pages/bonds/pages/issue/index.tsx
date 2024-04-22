import React, {useEffect, useRef, useState} from "react";
import {
    BondAndTokenData,
    BondAndTokenDataWithType,
    BondCombinedData,
    BondData,
    BondInfoForIssuance
} from "@/components/pages/bonds/pages/issue/type";
import {Chain, useAccount} from "wagmi";
import InfoBox from "@/components/utils/info-box";
import {CHAINS, defaultChain, getChain} from "@/modules/utils/wallet-connect";
import {InfoSections} from "@/components/pages/bonds/pages/issue/constants";
import Image from "next/image";
import {shortenString} from "@/modules/utils/string";
import {formatTime} from "@/modules/utils/dates";
import {format, formatLargeNumber} from "@/modules/utils/numbers";
import {TokenResponse, TokensResponse} from "@/modules/api/type";
import CloudAPI from "../../../../../modules/api/cloud";
import makeBlockie from "ethereum-blockies-base64";
import {isAddress, zeroAddress} from "viem";
import {IssuerContractInfoDetailed} from "@/modules/web3/type";
import VerifiedSVG from "../../../../../../public/svg/utils/verified";
import {Loading} from "@/components/utils/loading";
import WarningSVG from "../../../../../../public/svg/utils/warning";
import {TxTypes} from "@/modules/web3/constants";
import {toast} from "react-toastify";
import Link from "next/link";
import {URLS} from "@/modules/utils/urls";
import {useTransaction} from "@/modules/utils/transaction";
import {ConditionalRenderer, GeneralContainer, ToggleBetweenChildren, useShow} from "@/components/utils/container";
import {ModalTypes} from "@/store/redux/modal/constants";
import {StringKeyedObject} from "@/components/utils/general";
import {constants, FixedFlexIssuerController, utils} from "amet-utils";
import {InfoData} from "@/components/utils/types";
import ModalStore from "@/store/redux/modal";
import {useTokenBalance} from "@/components/pages/bonds/utils/balance";
import {UPDATE_INTERVAL} from "@/components/pages/bonds/pages/explore-bond-id/constants";
import BigNumber from "bignumber.js";
import {useTokensByChain} from "@/modules/utils/token";

export default function Issue() {
    const [bondInfo, setBondInfo] = useState({chainId: defaultChain.id} as BondInfoForIssuance);
    const [tokens, setTokens] = useState({} as TokensResponse)
    const [issuerContractInfo, setIssuerContractInfo] = useState({} as IssuerContractInfoDetailed)
    const {isOpen, setIsOpen} = useShow();

    const chain = getChain(bondInfo.chainId);
    const bondInfoHandler: any = [bondInfo, setBondInfo];
    const tokensHandler: any = [tokens, setTokens];


    useEffect(() => {
        if (chain) {
            setIssuerContractInfo({} as IssuerContractInfoDetailed);
            setIsOpen(true);
            FixedFlexIssuerController.getIssuerDetails(chain.id, utils.getIssuerContract(chain.id))
                .then(response => {
                    setIsOpen(false);
                    const normalizedAmount = Number(response.issuanceFee) / 10 ** chain.nativeCurrency.decimals;
                    setIssuerContractInfo({
                        ...response,
                        issuanceFeeUI: `${normalizedAmount} ${chain.nativeCurrency.symbol}`
                    })
                })
                .catch(error => console.error('getIssuerContractInfo', error))
        }
    }, [chain]);

    return (
        <GeneralContainer className='grid grid-cols-10 gap-6 md:py-32 py-12' isPadding>
            <IssuerContainer bondInfoHandler={bondInfoHandler}
                             tokensHandler={tokensHandler}
                             isLoading={isOpen}
                             issuerContractInfo={issuerContractInfo}/>
            <PreviewContainer bondInfoHandler={bondInfoHandler}
                              tokensHandler={tokensHandler}
                              issuerContractInfo={issuerContractInfo}/>
        </GeneralContainer>
    )
}

function IssuerContainer({bondInfoHandler, tokensHandler, issuerContractInfo, isLoading}: BondCombinedData & {isLoading: boolean}) {

    const [bondInfo] = bondInfoHandler;
    const [tokens] = tokensHandler
    const chain = getChain(bondInfo.chainId);

    const {submitTransaction} = useTransaction(bondInfo.chainId, TxTypes.IssueBond, {
        bondInfo,
        tokens,
        issuerContractInfo
    })

    async function issueBonds() {
        if (!chain) return toast.error("Please select correct chain")
        if (!bondInfo.totalBonds || bondInfo.totalBonds <= 0) return toast.error("Total Bonds must be greater than 0")
        if (!Number.isFinite(bondInfo.maturityPeriodInBlocks) || bondInfo.maturityPeriodInBlocks <= 0) return toast.error("Maturity Period must be greater than 0")
        if (!isAddress(bondInfo.purchaseToken) || !tokens[bondInfo.purchaseToken]) return toast.error("Purchase token is undefined")
        if (!isAddress(bondInfo.payoutToken) || !tokens[bondInfo.payoutToken]) return toast.error("Payout token is undefined")
        if (!Object.values(issuerContractInfo).length) return toast.error("Could not find Issuer information")
        if (issuerContractInfo.isPaused) return toast.error("Bond issuance is paused")

        const result = await submitTransaction();
        if (result) ModalStore.openModal(ModalTypes.IssuedBondSuccess, {...result, chainId: chain.id});
    }


    return <div
        className='lg-xl:col-span-6 col-span-12 flex flex-col gap-10 rounded-3xl lg:px-12 px-6 lg:py-8 md:py-6 py-4 bg-neutral-950'>
        <div className='flex flex-col gap-2'>
            <div className='flex justify-between items-center'>
                <h1 className='text-2xl font-bold'>Issue Your Bonds: Simple and Swift</h1>
                <ConditionalRenderer isOpen={isLoading}>
                    <Loading percent={80}/>
                </ConditionalRenderer>
            </div>
            <p className='text-xs text-zinc-600'>Our streamlined form guides you through each step to
                issue your bonds seamlessly. Just fill in the details - from bond type to maturity period - and
                set the parameters that suit your financial strategy.</p>
        </div>
        <div className='h-px w-full bg-zinc-800'/>
        <IssuanceForm bondInfoHandler={bondInfoHandler} tokensHandler={tokensHandler}/>
        <div className='flex flex-col gap-2'>
            <p className='flex items-center text-xs text-neutral-600 gap-1'>By issuing bond you agree with our
                <Link href={URLS.PrivacyPolicy} target="_blank">
                    <u>Privacy policy</u>
                </Link> and
                <Link href={URLS.TermsOfService} target="_blank">
                    <u>Terms of Service.</u>
                </Link></p>
            <button
                className='flex items-center justify-center gap-1 px-2 py-2.5 font-medium bg-neutral-200 text-black rounded-full hover:bg-white'
                onClick={issueBonds}>
                <span>Issue Bonds</span>
            </button>
        </div>
    </div>
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


    return (
        <div className='grid grid-cols-12 gap-4 mt-4'>
            <InputContainer id='totalBonds'
                            onChange={update}
                            placeholder="Total Bonds"
                            parentClassName='md:col-span-4 col-span-12 w-full flex items-center'
                            info={InfoSections.Total}/>

            <MaturityPeriodSelector bondInfoHandler={bondInfoHandler}/>
            <ChainSelector bondInfoHandler={bondInfoHandler}/>
            <TokenSelector type='purchaseToken' bondInfoHandler={bondInfoHandler} tokensHandler={tokensHandler}/>
            <TokenSelector type='payoutToken' bondInfoHandler={bondInfoHandler} tokensHandler={tokensHandler}/>
            <InputContainer id="purchaseAmount"
                            onChange={update}
                            placeholder="Purchase Amount Per Bond"
                            parentClassName='md:col-span-6 col-span-12 w-full flex justify-between gap-3'
                            info={InfoSections.PurchaseAmount}/>
            <InputContainer id="payoutAmount"
                            onChange={update}
                            placeholder="Payout Amount Per Bond"
                            parentClassName='md:col-span-6 col-span-12 w-full flex justify-between gap-3'
                            info={InfoSections.PayoutAmount}/>
        </div>
    )
}

function TokenSelector({type, bondInfoHandler, tokensHandler}: BondAndTokenDataWithType) {


    const isPurchase = type === 'purchaseToken'
    const title = isPurchase ? "Purchase Token" : "Payout Token";
    const placeholder = `${title} Contract Address`
    const infoObject = isPurchase ? InfoSections.PurchaseToken : InfoSections.PayoutToken

    const {address} = useAccount();
    const [bondInfo, setBondInfo] = bondInfoHandler;
    const verifiedTokens = useTokensByChain(bondInfo.chainId);

    const [tokens, setTokens] = tokensHandler;
    const {isOpen, setIsOpen, openOrClose} = useShow();
    const boxRef = useRef<any>(null)

    const tokenAddress = ((isPurchase ? bondInfo.purchaseToken : bondInfo.payoutToken) || "").toLowerCase();

    const verifiedTokensArray = Object.values(verifiedTokens)
    const isShow = Boolean(verifiedTokensArray.length) && isOpen

    useEffect(() => {
        const handleClickOutside = (event: Event) => {
            if (boxRef.current && !boxRef.current.contains(event.target)) {
                setIsOpen(false);
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
                    if (tokensResponse) {
                        const _id = `${tokenAddress}_${bondInfo.chainId}`.toLowerCase()
                        const token = tokensResponse[_id]
                        if (token) {
                            setTokens({...tokens, [tokenAddress.toLowerCase()]: token})
                        } else {
                            setTokens({...tokens, [tokenAddress]: {unidentified: true}})
                        }
                    }
                })
            }
        }, 2000)

        return () => clearTimeout(timeout)
    }, [bondInfo.chainId, tokenAddress, address, tokens, setTokens]);

    const setTokenType = (contractAddress: string) => setBondInfo({
        ...bondInfo,
        [type]: (contractAddress || "").toLowerCase()
    })
    const changeInput = (event: any) => setTokenType(event.target.value)
    const selectToken = (contractAddress: string) => {
        setTokenType(contractAddress)
        setIsOpen(false);
    }


    return <div className='relative md:col-span-6 col-span-12 w-full flex flex-col justify-between gap-4 h-full'
                ref={boxRef}>
        <InputContainer id={type}
                        type='text'
                        onChange={changeInput}
                        onClick={openOrClose}
                        value={tokenAddress}
                        placeholder={placeholder}
                        parentClassName='w-full flex items-center gap-2'
                        info={infoObject}/>
        <ConditionalRenderer isOpen={isShow}>
            <div
                className='absolute flex flex-col gap-1 bg-[#131313] w-full rounded-md top-[110%] left-0 z-10 max-h-56 overflow-y-auto'>
                {verifiedTokensArray.map(token => <TokenForSelector token={token}
                                                                    key={token.contractAddress}
                                                            onClick={selectToken}/>)}
            </div>
        </ConditionalRenderer>
    </div>


}

function TokenForSelector({token, onClick}: Readonly<{ token: TokenResponse, onClick: any }>) {

    const iconSrc = token.icon ?? makeBlockie(zeroAddress);

    return <button
        className='flex items-center gap-1 w-full cursor-pointer px-4 py-2 hover:bg-neutral-800 rounded-md whitespace-nowrap'
                   onClick={() => onClick(token.contractAddress)}>
        <Image src={iconSrc} alt={token.name} width={22} height={22}
               className='rounded-full border border-neutral-400'/>
        <p className='text-neutral-300 text-sm'>{token.name} <span
            className='text-neutral-500'>({token.symbol})</span></p>
    </button>
}

function MaturityPeriodSelector({bondInfoHandler}: Readonly<BondData>) {
    const [bondInfo, setBondInfo] = bondInfoHandler;
    const Types: StringKeyedObject<string> = {
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


    const boxRef = useRef<any>(null)
    const [type, setType] = useState(Types.Days);
    const {isOpen, setIsOpen, openOrClose} = useShow();
    const inputValue = type === Types.Blocks ? bondInfo.maturityPeriodInBlocks : (bondInfo.maturityPeriodInBlocks * constants.CHAIN_BLOCK_TIMES[bondInfo.chainId]) / Timers[type];

    useEffect(() => {
        const handleClickOutside = (event: Event) => {
            if (boxRef.current && !boxRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => document.removeEventListener('click', handleClickOutside)
    }, [boxRef]);


    function updateMaturityPeriod(calculationType: string, value: number) {
        const preValue = Timers[calculationType] * Number(value)
        if (!constants.CHAIN_BLOCK_TIMES[bondInfo.chainId]) return toast.error("Please select the chain first!")

        const maturityPeriodInBlocks = calculationType === Types.Blocks ? preValue : preValue / constants.CHAIN_BLOCK_TIMES[bondInfo.chainId]
        setBondInfo({...bondInfo, maturityPeriodInBlocks})
    }

    const changeType = (event: any) => {
        const updatedType = event.target.id;

        setType(updatedType);
        updateMaturityPeriod(updatedType, inputValue);
        openOrClose()
    }

    function changeTime(event: any) {
        const {value} = event.target;
        updateMaturityPeriod(type, value)
    }

    return (
        <InputContainer id="day"
                        placeholder="Maturity Period"
                        parentClassName='relative md:col-span-4 col-span-12 flex items-center w-full gap-2'
                        onChange={changeTime}
                        info={InfoSections.MaturityPeriod}>

            <button className='relative flex justify-center items-center cursor-pointer h-full'
                    onClick={openOrClose} ref={boxRef}>
                <span className='text-center w-full capitalize'>{type}</span>
            </button>
            <ConditionalRenderer isOpen={isOpen}>
                <div
                    className='absolute top-[110%] right-0 bg-[#131313] flex flex-col z-10 text-sm text-center rounded-md gap-1'>
                    {
                        Object.keys(Types)
                            .map(key => (
                                <button className='px-5 py-1 cursor-pointer hover:bg-neutral-800 capitalize rounded-md'
                                        id={Types[key]} onClick={changeType} key={key}>{key}</button>))
                    }
                </div>
            </ConditionalRenderer>
        </InputContainer>
    )
}

function ChainSelector({bondInfoHandler}: Readonly<BondData>) {
    const [bondInfo, setBondInfo] = bondInfoHandler;
    const {isOpen, openOrClose, setIsOpen} = useShow();
    const boxRef = useRef<any>(null)

    useEffect(() => {
        const handleClickOutside = (event: Event) => {
            if (boxRef.current && !boxRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => document.removeEventListener('click', handleClickOutside)
    }, [boxRef]);


    const selectChain = (chainId: number) => setBondInfo({...bondInfo, chainId})

    const chainInfo = getChain(bondInfo.chainId)

    return <div className='md:col-span-4 col-span-12 w-full relative flex flex-col justify-center gap-3'
                ref={boxRef}>
        <button
            className='flex justify-start items-center bg-[#131313] rounded-md px-4 py-2 cursor-pointer h-full'
            onClick={openOrClose}>
            <div className='flex gap-2 items-center'>
                <Image src={`/svg/chains/${chainInfo?.id}.svg`} alt={chainInfo?.name ?? ""}
                       width={24}
                       height={24}/>
                <span className='text-sm '>{shortenString(chainInfo?.name ?? "", 15)}</span>
            </div>
            <ConditionalRenderer isOpen={isOpen}>
                <div className="flex absolute flex-col bg-[#131313] rounded-md left-0 top-[110%] z-10 w-full">
                    {CHAINS.map(chain => <ChainContainer chain={chain} selectChain={selectChain} key={chain.id}/>)}
                </div>
            </ConditionalRenderer>
        </button>
    </div>
}

function ChainContainer({chain, selectChain}: Readonly<{ chain: Chain, selectChain: any }>) {
    const select = () => selectChain(chain.id);

    return <button className='flex gap-2 items-center w-full hover:bg-neutral-800 px-3 py-2 rounded-md'
                   onClick={select}>
        <Image src={`/svg/chains/${chain.id}.svg`} alt={chain.name} width={24} height={24}/>
        <span className='text-start text-sm font-medium min-w-full'>{shortenString(chain.name || "", 16)}</span>
    </button>
}


function PreviewContainer({bondInfoHandler, tokensHandler, issuerContractInfo}: BondCombinedData) {
    return <div
        className='lg-xl:col-span-4 col-span-12 flex flex-col gap-8 rounded-3xl md:px-12 px-6 py-8 bg-neutral-950'>
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
}

function Preview({bondInfoHandler, tokensHandler, issuerContractInfo}: BondCombinedData) {

    const [bondInfo] = bondInfoHandler;
    const [tokens] = tokensHandler;

    const chainInfo = getChain(bondInfo.chainId)

    const maturityPeriodTime = (constants.CHAIN_BLOCK_TIMES[bondInfo.chainId] * bondInfo.maturityPeriodInBlocks) || 0
    const maturityPeriodStrLong = formatTime(maturityPeriodTime)
    const maturityPeriodStr = formatTime(maturityPeriodTime, true)

    const showTotalBondsContainer = Number.isFinite(bondInfo.totalBonds)
    const showMaturityContainer = Number.isFinite(bondInfo.maturityPeriodInBlocks) && bondInfo.maturityPeriodInBlocks > 0
    const showChainContainer = Number.isFinite(bondInfo.chainId)
    const showPurchaseTokenContainer = Boolean(bondInfo.purchaseToken)
    const showPayoutTokenContainer = Boolean(bondInfo.payoutToken)

    return (
        <div className='flex flex-col justify-between h-full gap-2'>
            <div className='grid grid-cols-12 mt-4 gap-4'>
                <ConditionalRenderer isOpen={showTotalBondsContainer}>
                    <div className='col-span-4 w-full flex flex-col items-center gap-0.5 cursor-pointer'
                         title={bondInfo.totalBonds?.toString()}>
                        <span className='text-base font-medium'>{formatLargeNumber(bondInfo.totalBonds)}</span>
                        <span className='text-neutral-500 text-xs'>Total</span>
                    </div>
                </ConditionalRenderer>
                <ConditionalRenderer isOpen={showMaturityContainer}>
                    <div className='col-span-4 w-full flex flex-col items-center gap-0.5 cursor-pointer'
                         title={`${maturityPeriodStrLong} or ${format(bondInfo.maturityPeriodInBlocks)} blocks`}>
                    <span
                        className='text-base whitespace-nowrap font-medium'>{shortenString(maturityPeriodStr, 9)}</span>
                        <span className='text-neutral-500 text-xs'>Maturity Period</span>
                    </div>
                </ConditionalRenderer>
                <ConditionalRenderer isOpen={showChainContainer}>
                    <div className='col-span-4 w-full flex flex-col items-center gap-0.5 cursor-pointer'>
                        <div className='flex gap-2 items-center texee'>
                            <Image src={`/svg/chains/${chainInfo?.id}.svg`} alt={chainInfo?.name ?? ""}
                                   width={24}
                                   height={24}/>
                            <span className='text-base font-medium'>{shortenString(chainInfo?.name ?? "", 5)}</span>
                        </div>
                        <span className='text-neutral-500 text-xs'>Chain</span>
                    </div>
                </ConditionalRenderer>
                <ConditionalRenderer isOpen={showPurchaseTokenContainer}>
                    <TokenPreview
                        type='purchaseToken'
                        token={tokens[bondInfo.purchaseToken]}
                        issuerContractInfo={issuerContractInfo}
                        bondInfo={bondInfo}/>
                </ConditionalRenderer>
                <ConditionalRenderer isOpen={showPayoutTokenContainer}>
                    <TokenPreview type='payoutToken'
                                  token={tokens[bondInfo.payoutToken]}
                                  issuerContractInfo={issuerContractInfo}
                                  bondInfo={bondInfo}/>
                </ConditionalRenderer>
            </div>
            <ConditionalRenderer isOpen={Boolean(issuerContractInfo.issuanceFeeUI)}>
                <p className='text-mm text-neutral-600'>You will incur an issuance fee
                    of {issuerContractInfo.issuanceFeeUI} and a {issuerContractInfo.purchaseRate / 10}% fee on each bond
                    purchase. If bondholders choose capitulation redeem, you will
                    receive {issuerContractInfo.earlyRedemptionRate / 10}% of the payout tokens back.</p>
            </ConditionalRenderer>
        </div>
    )
}


function TokenPreview({type, token, bondInfo, issuerContractInfo}: Readonly<{
    type: string,
    token: TokenResponse,
    bondInfo: BondInfoForIssuance,
    issuerContractInfo: IssuerContractInfoDetailed
}>) {

    const {address} = useAccount();
    const chain = getChain(bondInfo.chainId)
    const isPurchase = type === "purchaseToken";
    const tokenAddress = isPurchase ? bondInfo.purchaseToken : bondInfo.payoutToken;
    const {balance, isLoading} = useTokenBalance(bondInfo.chainId, tokenAddress, `${address}`, UPDATE_INTERVAL)
    const balanceClean = BigNumber(balance).div(BigNumber(10).pow(BigNumber(token?.decimals ?? 0))).toNumber()

    const title = isPurchase ? "Purchase" : "Payout";
    const amountTitle = isPurchase ? "Total Purchase Amount" : "Total Payout Amount"

    if (!token) {
        if (isAddress(tokenAddress)) return <TokenContainer><Loading/></TokenContainer>
        else if (!isAddress(tokenAddress)) return <UnidentifiedToken chain={chain}/>
        else return null
    }

    if (token.unidentified) {
        return <UnidentifiedToken chain={chain}/>
    }

    const purchaseRateClean = issuerContractInfo.purchaseRate / 10;
    const iconSrc = token.icon ?? makeBlockie(zeroAddress);
    let totalTmp = bondInfo.totalBonds * (isPurchase ? bondInfo.purchaseAmount : bondInfo.payoutAmount) || 0;
    const total = isPurchase ? totalTmp - ((totalTmp * purchaseRateClean) / 100) : totalTmp

    const valueClass = isPurchase ? "text-green-500" : "text-red-500";

    return (
        <TokenContainer>
            <span className='font-semibold'>{title}:</span>
            <div className='flex items-center gap-1.5'>
                <Image src={iconSrc} alt={token.name} width={32} height={32}
                       className='object-contain rounded-full border border-neutral-400'/>
                <div className='flex flex-col'>
                    <div className='flex items-center gap-1.5'>
                        <p className='text-sm'>{token.name}<span className='text-neutral-300'>({token.symbol})</span>
                        </p>
                        <ConditionalRenderer isOpen={Boolean(token.isVerified)}>
                            <VerifiedSVG/>
                        </ConditionalRenderer>
                    </div>
                    <div className='flex items-center gap-1 text-mm text-neutral-400'>
                        <span>Balance:</span>
                        <ToggleBetweenChildren isOpen={isLoading}>
                            <Loading percent={85}/>
                            <span>{formatLargeNumber(balanceClean)} {token.symbol}</span>
                        </ToggleBetweenChildren>
                    </div>
                </div>
            </div>
            <ConditionalRenderer isOpen={Boolean(total)}>
                <div className='flex flex-col'>
                    <div className='flex gap-1'>
                        <p className='text-sm whitespace-nowrap'>{amountTitle}:</p>
                        <div className='group relative w-full'>
                            <div className={`flex items-center gap-1 font-bold text-sm ${valueClass}`}>
                                <span>{formatLargeNumber(total)}</span>
                                <span>{token.symbol}</span>
                            </div>
                            <div
                                className='absolute bg-neutral-700 rounded-md px-2 left-0 top-full hidden group-hover:flex'>
                                <span
                                    className='text-neutral-200 text-sm whitespace-nowrap'>{format(total)} {token.symbol}</span>
                            </div>
                        </div>
                    </div>
                    <ConditionalRenderer isOpen={isPurchase}>
                        <span className='text-neutral-500 text-mm'>We charge {purchaseRateClean}% on every purchased bond.</span>
                    </ConditionalRenderer>
                </div>
            </ConditionalRenderer>
        </TokenContainer>
    )
}

function TokenContainer({children}: { children?: any }) {
    return <div
        className='col-span-12 w-full flex flex-col gap-2 cursor-pointer bg-neutral-900 rounded-xl p-6 py-3'>{children}</div>
}

function UnidentifiedToken({chain}: Readonly<{ chain?: Chain }>) {
    return <TokenContainer>
        <div className='flex justify-start gap-1 cursor-pointer'>
            <p className='text-sm'>
                Could not identify the token, make sure the contract is correct for {" "}
                <span className="text-red-500 font-bold"> {chain?.name} network</span>
            </p>
            <WarningSVG/>
        </div>
    </TokenContainer>
}

function InputContainer({
                            id,
                            type,
                            inputClassName,
                            value,
                            parentClassName,
                            children,
                            onClick,
                            placeholder,
                            info,
                            onChange
                        }: Readonly<{
    id: string,
    placeholder: string,
    onChange: any,
    info: InfoData
    parentClassName: string,
    value?: string | number,
    children?: React.ReactNode,
    type?: string,
    inputClassName?: string,
    onClick?: any,
}>) {

    return (
        <div className={parentClassName + " bg-[#131313] rounded-md placeholder:text-[#3C3C3C] py-3 px-4 text-sm"}>
            <input id={id}
                   type={type ?? "number"}
                   className={inputClassName + " bg-transparent w-full"}
                   onClick={onClick}
                   value={value}
                   autoComplete="off"
                   placeholder={placeholder}
                   onChange={onChange}/>
            {children}
            <ConditionalRenderer isOpen={Boolean(info)}>
                <InfoBox info={info} className='whitespace-nowrap' isRight/>
            </ConditionalRenderer>
        </div>
    )
}
