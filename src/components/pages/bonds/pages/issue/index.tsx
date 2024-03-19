import {useEffect, useRef, useState} from "react";
import {
    BondAndTokenData,
    BondAndTokenDataWithType,
    BondCombinedData,
    BondData,
    BondInfoForIssuance
} from "@/components/pages/bonds/pages/issue/type";
import {Chain, useAccount} from "wagmi";
import InfoBox from "@/components/utils/info-box";
import {CHAINS, getChain} from "@/modules/utils/wallet-connect";
import {InfoSections} from "@/components/pages/bonds/pages/issue/constants";
import Image from "next/image";
import {shortenString} from "@/modules/utils/string";
import {formatTime} from "@/modules/utils/dates";
import {format, formatLargeNumber} from "@/modules/utils/numbers";
import {TokenResponse, TokensResponse} from "@/modules/cloud-api/type";
import CloudAPI from "@/modules/cloud-api";
import makeBlockie from "ethereum-blockies-base64";
import {isAddress, zeroAddress} from "viem";
import {IssuerContractInfoDetailed} from "@/modules/web3/type";

import TokenController from "@/modules/web3/tokens";
import BigNumber from "bignumber.js";
import {polygonMumbai} from "wagmi/chains";
import VerifiedSVG from "../../../../../../public/svg/utils/verified";
import {Loading} from "@/components/utils/loading";
import WarningSVG from "../../../../../../public/svg/utils/warning";
import {BlockTimes, TxTypes} from "@/modules/web3/constants";
import {toast} from "react-toastify";
import FixedFlexIssuerController from "@/modules/web3/fixed-flex/v2/issuer";
import Link from "next/link";
import {URLS} from "@/modules/utils/urls";
import {useTransaction} from "@/modules/utils/transaction";
import {ConditionalRenderer, GeneralContainer, ToggleBetweenChildren, useShow} from "@/components/utils/container";
import {openModal} from "@/store/redux/modal";
import {ModalTypes} from "@/store/redux/modal/constants";
import {StringKeyedObject} from "@/components/utils/general";


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

            FixedFlexIssuerController.getIssuerContractInfo(chain)
                .then(response => {
                    setIssuerContractInfo(response)
                })
                .catch(error => console.log(error))
        }
    }, [bondInfo.chainId]);

    return <GeneralContainer className='grid grid-cols-10 gap-6 md:py-32 py-12' isPadding>
        <IssuerContainer bondInfoHandler={bondInfoHandler}
                         tokensHandler={tokensHandler}
                         issuerContractInfo={issuerContractInfo}/>
        <PreviewContainer bondInfoHandler={bondInfoHandler}
                          tokensHandler={tokensHandler}
                          issuerContractInfo={issuerContractInfo}/>
    </GeneralContainer>
}

function IssuerContainer({bondInfoHandler, tokensHandler, issuerContractInfo}: BondCombinedData) {

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
        if (!isAddress(bondInfo.purchaseToken) || !tokens[bondInfo.purchaseToken]) return toast.error("purchase token is undefined")
        if (!isAddress(bondInfo.payoutToken) || !tokens[bondInfo.payoutToken]) return toast.error("payout token is undefined")

        const result = await submitTransaction();
        if (result) openModal(ModalTypes.IssuedBondSuccess, {...result, chainId: chain.id});
    }


    return <div
        className='lg-xl:col-span-6 col-span-12 flex flex-col gap-10 rounded-3xl lg:px-12 px-6 lg:py-8 md:py-6 py-4 bg-neutral-950'>
        <div className='flex flex-col gap-2'>
            <h1 className='text-2xl font-bold'>Issue Your Bonds: Simple and Swift</h1>
            <p className='text-xs text-zinc-600'>Our streamlined form guides you through each step to
                issue your bonds seamlessly. Just fill in the details - from bond type to maturity period - and
                set the parameters that suit your financial strategy.</p>
        </div>
        <div className='h-px w-full bg-zinc-800'/>
        <IssuanceForm bondInfoHandler={bondInfoHandler} tokensHandler={tokensHandler}/>
        <div className='flex flex-col gap-2'>
            <p className='flex items-center text-sm text-neutral-600 gap-1'>By issuing bond you agree with our
                <Link href={URLS.PrivacyPolicy} target="_blank">
                    <u>Privacy policy</u>
                </Link> and
                <Link href={URLS.TermsOfService} target="_blank">
                    <u>Terms of Service.</u>
                </Link></p>
            <button
                className='flex items-center justify-center gap-1 px-2 py-3 font-medium bg-neutral-200 text-black rounded-full hover:bg-white'
                    onClick={issueBonds}>
                <span>Issue Bonds</span>
                <ConditionalRenderer isOpen={Boolean(issuerContractInfo.issuanceFeeUI)}>
                    <span className='text-red-500'>({issuerContractInfo.issuanceFeeUI})</span>
                </ConditionalRenderer>
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


    return <div className='grid grid-cols-12 gap-4 mt-4'>
        <div className='col-span-4 w-full flex flex-col gap-3'>
            <InfoBox info={InfoSections.Total}><span
                className='text-white text-md font-medium'>Total:</span></InfoBox>
            <BasicInput id='totalBonds'
                        onChange={update}
                        placeholder='Total amount of Bonds'/>
        </div>
        <MaturityPeriodSelector bondInfoHandler={bondInfoHandler}/>
        <ChainSelector bondInfoHandler={bondInfoHandler}/>
        <TokenSelector type='purchaseToken' bondInfoHandler={bondInfoHandler} tokensHandler={tokensHandler}/>
        <TokenSelector type='payoutToken' bondInfoHandler={bondInfoHandler} tokensHandler={tokensHandler}/>
        <div className='md:col-span-6 col-span-12 w-full flex flex-col justify-between gap-3'>
            <InfoBox info={InfoSections.PurchaseAmount}>
                <span className='text-white text-md font-medium whitespace-nowrap'>Purchase Amount:</span>
            </InfoBox>
            <BasicInput id="purchaseAmount"
                        placeholder='Purchase Amount Per Bond'
                        onChange={update}/>
        </div>
        <div className='md:col-span-6 col-span-12 w-full flex flex-col justify-between gap-3'>
            <InfoBox info={InfoSections.PayoutAmount}>
                <span className='text-white text-md font-medium whitespace-nowrap'>Payout Amount:</span>
            </InfoBox>
            <BasicInput id="payoutAmount"
                        placeholder='Payout Amount Per Bond'
                        onChange={update}/>
        </div>
    </div>
}

function TokenSelector({type, bondInfoHandler, tokensHandler}: BondAndTokenDataWithType) {

    const isPurchase = type === 'purchaseToken'
    const title = isPurchase ? "Purchase Token" : "Payout Token";
    const placeholder = `${title} Contract Address`
    const infoObject = isPurchase ? InfoSections.PurchaseToken : InfoSections.PayoutToken

    const {address} = useAccount();
    const [bondInfo, setBondInfo] = bondInfoHandler;
    const [tokens, setTokens] = tokensHandler;
    const {isOpen, setIsOpen, openOrClose} = useShow();
    const inputRef = useRef<any>()
    const boxRef = useRef<any>(null)

    const tokenAddress = ((isPurchase ? bondInfo.purchaseToken : bondInfo.payoutToken) || "").toLowerCase();
    const tokensArray = Object.values(tokens)
    const isShow = Boolean(tokensArray.length) && isOpen


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
                        const token = tokensResponse[tokenAddress]
                        if (token) {
                            setTokens({...tokens, [tokenAddress]: token})
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
        inputRef.current.value = contractAddress;
        setIsOpen(false);
    }


    return <div className='relative md:col-span-6 col-span-12 w-full flex flex-col justify-between gap-3 h-full'
                ref={boxRef}>
        <InfoBox info={infoObject}><span
            className='text-white text-md font-medium whitespace-nowrap'>{title}:</span></InfoBox>
        <input type='text'
               className='bg-[#131313] rounded-md placeholder:text-[#3C3C3C] py-3 px-4 text-base'
               placeholder={placeholder}
               ref={inputRef}
               onClick={openOrClose}
               onChange={changeInput}/>
        <ConditionalRenderer isOpen={isShow}>
            <div
                className='absolute flex flex-col gap-1 bg-[#131313] w-full border border-w1 rounded-md top-full left-0 z-10'>
                {tokensArray.map(token => <TokenForSelector token={token} key={token._id} onClick={selectToken}/>)}
            </div>
        </ConditionalRenderer>
    </div>
}

function TokenForSelector({token, onClick}: Readonly<{ token: TokenResponse, onClick: any }>) {

    const iconSrc = token.icon ?? makeBlockie(zeroAddress);

    return <button className='flex items-center gap-1 w-full cursor-pointer px-4 py-2 hover:bg-neutral-800'
                   onClick={() => onClick(token.contractAddress)}>
        <Image src={iconSrc} alt={token.name} width={22} height={22}
               className='rounded-full border border-neutral-400'/>
        <p className='text-neutral-300 text-sm'>{token.name} <span
            className='text-neutral-500'>({token.symbol})</span></p>
    </button>
}

function MaturityPeriodSelector({bondInfoHandler}: BondData) {
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

    const inputRef = useRef<any>(null);
    const boxRef = useRef<any>(null)
    const [type, setType] = useState(Types.Days);
    const {isOpen, setIsOpen, openOrClose} = useShow();

    useEffect(() => {
        const handleClickOutside = (event: Event) => {
            if (boxRef.current && !boxRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => document.removeEventListener('click', handleClickOutside)
    }, [boxRef]);


    function updateMaturityPeriod(type: string, value: number) {
        const preValue = Timers[type] * Number(value)
        if (!BlockTimes[bondInfo.chainId]) return toast.error("Please select the chain first!")

        const maturityPeriodInBlocks = type === Types.Blocks ? preValue : preValue / BlockTimes[bondInfo.chainId]
        setBondInfo({...bondInfo, maturityPeriodInBlocks})
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

    return <div className='md:col-span-4 col-span-8 w-full flex flex-col gap-3'>
            <InfoBox info={InfoSections.MaturityPeriod}><span
                className='text-white text-md font-medium whitespace-nowrap'>Maturity Period:</span></InfoBox>
            <div className='relative grid grid-cols-7 gap-4 rounded-md h-full bg-[#131313] text-base'>
                <input type="number"
                       id='day'
                       placeholder="Choose Maturity Period"
                       onChange={changeTime}
                       ref={inputRef}
                       className='bg-transparent col-span-4 placeholder:text-[#3C3C3C] pl-4 py-3'/>

                <button className='col-span-3 relative flex justify-center items-center cursor-pointer h-full pr-4 py-3'
                     onClick={openOrClose} ref={boxRef}>
                    <span className='text-center w-full capitalize'>{type}</span>
                </button>
                <ConditionalRenderer isOpen={isOpen}>
                    <div
                        className='absolute top-full right-0 bg-[#131313] flex flex-col z-10 text-sm text-center rounded-md border border-w1 '>
                        {
                            Object.keys(Types)
                                .map(key => (
                                    <button className='px-5 py-1 cursor-pointer hover:bg-neutral-800 capitalize'
                                            id={Types[key]} onClick={changeType} key={key}>{key}</button>))
                        }
                    </div>
                </ConditionalRenderer>
            </div>
    </div>
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
        <InfoBox info={InfoSections.Chain}><span className='text-white text-md font-medium'>Chain:</span></InfoBox>

        <button
            className='flex justify-start items-center bg-[#131313] rounded-md px-4 py-2 cursor-pointer h-full'
            onClick={openOrClose}>
            <div className='flex gap-2 items-center'>
                <Image src={`/svg/chains/${chainInfo?.id}.svg`} alt={chainInfo?.name ?? ""}
                       width={24}
                       height={24}/>
                <span className='text-sm font-medium'>{shortenString(chainInfo?.name ?? "", 15)}</span>
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

    return <button className='flex gap-2 items-center w-full hover:bg-neutral-800 px-3 py-2' onClick={select}>
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

    const maturityPeriodTime = (BlockTimes[bondInfo.chainId] * bondInfo.maturityPeriodInBlocks) || 0
    const maturityPeriodStr = formatTime(maturityPeriodTime, true)

    return <div className='grid grid-cols-12 mt-4 gap-4'>

        <ConditionalRenderer isOpen={Number.isFinite(bondInfo.totalBonds)}>
            <div className='col-span-4 w-full flex flex-col items-center gap-0.5 cursor-pointer'
                 title={bondInfo.totalBonds?.toString()}>
                <span className='text-base font-medium'>{formatLargeNumber(bondInfo.totalBonds)}</span>
                <span className='text-neutral-500 text-xs'>Total</span>
            </div>
        </ConditionalRenderer>
        <ConditionalRenderer
            isOpen={Number.isFinite(bondInfo.maturityPeriodInBlocks) && bondInfo.maturityPeriodInBlocks > 0}>
            <div className='col-span-4 w-full flex flex-col items-center gap-0.5 cursor-pointer'
                 title={maturityPeriodStr}>
                <span className='text-base whitespace-nowrap font-medium'>{shortenString(maturityPeriodStr, 9)}</span>
                <span className='text-neutral-500 text-xs'>Maturity Period</span>
            </div>
        </ConditionalRenderer>
        <ConditionalRenderer isOpen={Number.isFinite(bondInfo.chainId)}>
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
        <ConditionalRenderer isOpen={Boolean(bondInfo.purchaseToken)}>
            <TokenPreview
                type='purchaseToken'
                token={tokens[bondInfo.purchaseToken]}
                issuerContractInfo={issuerContractInfo}
                bondInfo={bondInfo}/>
        </ConditionalRenderer>
        <ConditionalRenderer isOpen={Boolean(bondInfo.payoutToken)}>
            <TokenPreview type='payoutToken'
                          token={tokens[bondInfo.payoutToken]}
                          issuerContractInfo={issuerContractInfo}
                          bondInfo={bondInfo}/>
        </ConditionalRenderer>
    </div>
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
                TokenController.getTokenBalance(chain, tokenAddress, address)
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
            }, 3000)
            return () => clearInterval(interval)
        }
    }, [chain, address, token, tokenAddress]);

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

    const iconSrc = token.icon ?? makeBlockie(zeroAddress);
    let totalTmp = bondInfo.totalBonds * (isPurchase ? bondInfo.purchaseAmount : bondInfo.payoutAmount) || 0;
    const total = isPurchase ? totalTmp - ((totalTmp * issuerContractInfo.purchaseRate) / 100) : totalTmp

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
                        <ConditionalRenderer isOpen={token.isVerified}>
                            <VerifiedSVG/>
                        </ConditionalRenderer>
                    </div>
                    <div className='flex items-center gap-1 text-mm text-neutral-400'>
                        <span>Balance:</span>
                        <ToggleBetweenChildren isOpen={balance.isLoading}>
                            <Loading percent={85}/>
                            <span>{formatLargeNumber(balance.value)} {token.symbol}</span>
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
                        <span className='text-neutral-500 text-mm'>We charge {issuerContractInfo.purchaseRate}% on every purchased bond.</span>
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


function BasicInput({id, type, className, onChange, onClick, ref, placeholder}: Readonly<{
    id?: string,
    type?: string,
    className?: string,
    onChange?: any,
    placeholder?: string,
    onClick?: any,
    ref?: any,
}>) {
    return <input id={id}
                  type={type ?? "number"}
                  className={'bg-[#131313] rounded-md placeholder:text-[#3C3C3C] py-3 px-4 text-base ' + className}
                  onClick={onClick}
                  ref={ref}
                  placeholder={placeholder}
                  onChange={onChange}/>
}
