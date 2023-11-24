import Styles from "./index.module.css";
import Image from "next/image";
import {useEffect, useState} from "react";
import {dayInSec, formatTime, hourInSec, monthInSec, yearInSec} from "@/modules/utils/dates";
import {BondInfo, TokenDetails} from "@/components/pages/bonds/pages/issue/type";
import Loading from "@/components/utils/loading";
import {TxTypes, ZCB_ISSUER_CONTRACTS, ZERO_ADDRESS} from "@/modules/web3/constants";
import {openModal} from "@/store/redux/modal";
import {ModalTypes} from "@/store/redux/modal/constants";
import {toast} from "react-toastify";
import {format} from "@/modules/utils/numbers";
import WarningSVG from "../../../../../../public/svg/warning";
import ClockSVG from "../../../../../../public/svg/clock";
import {join} from "@/modules/utils/styles";
import TypeSVG from "../../../../../../public/svg/type";
import TotalSVG from "../../../../../../public/svg/total";
import {URLS} from "@/modules/utils/urls";
import Link from "next/link";
import {IssuerContractInfo, TokenResponseDetailed} from "@/modules/web3/type";
import {Chain, useAccount, useNetwork, useSendTransaction} from "wagmi";
import {getContractInfoByType, trackTransaction} from "@/modules/web3";
import {useWeb3Modal} from "@web3modal/wagmi/react";
import {getIssuerContractInfo} from "@/modules/web3/zcb";
import InfoBox from "@/components/utils/info-box";
import CloudAPI from "@/modules/cloud-api";
import {BondTokenInfo, InfoSections} from "@/components/pages/bonds/pages/issue/constants";
import {defaultChain} from "@/modules/utils/wallet-connect";
import makeBlockie from "ethereum-blockies-base64";
import VerifiedSVG from "../../../../../../public/svg/verified";


export default function Issue() {

    const {address} = useAccount();
    const network = useNetwork();
    const chain = network.chain || defaultChain;
    const {open} = useWeb3Modal()

    const [additionalInfo, setAdditionalInfo] = useState({} as IssuerContractInfo)
    const [bondInfo, setBondInfo] = useState({total: 0, redeemLockPeriod: 0} as BondInfo);

    const [investmentTokenInfo, setInvestmentTokenInfo] = useState({} as TokenResponseDetailed)
    const [interestTokenInfo, setInterestTokenInfo] = useState({} as TokenResponseDetailed)
    const bondsHandler = [bondInfo, setBondInfo]


    const contractInfo = getContractInfoByType(chain, TxTypes.IssueBond, {
        bondInfo: {
            ...bondInfo,
            investmentTokenInfo,
            interestTokenInfo
        }, additionalInfo
    })

    const {isLoading, sendTransactionAsync} = useSendTransaction({
        to: contractInfo.to,
        value: BigInt(contractInfo.value || 0) || undefined,
        data: contractInfo.data,
    })


    async function submit() {
        try {

            if (additionalInfo.isPaused) {
                return toast.error("Issuing is paused at the moment")
            }

            if (
                !bondInfo.investmentToken ||
                !bondInfo.interestToken ||
                !bondInfo.total ||
                !bondInfo.redeemLockPeriod ||
                !bondInfo.investmentTokenAmount ||
                !bondInfo.interestTokenAmount
            ) {
                return toast.error(`Please fill all the empty inputs`)
            }


            if (investmentTokenInfo?.unidentified) {
                return toast.error(`We could not identify the Investment token`)
            }

            if (interestTokenInfo?.unidentified) {
                toast.error(`We could not identify the Interest token`)
                return;
            }

            if (!address) {
                return open()
            }


            const response = await sendTransactionAsync();
            if (response?.hash && chain) {
                const txResponse = await trackTransaction(chain, response?.hash)
                if (txResponse) {
                    const {transaction, decoded} = txResponse
                    return openModal(ModalTypes.IssuedBondSuccess, {
                        bondInfo,
                        transaction,
                        decoded
                    })
                }

            }

        } catch (error: any) {
            // toast.error(error.message)
        }
    }

    function onChange(event: Event | any) {
        let {id, value, type} = event.target;
        if (type === 'number') {
            value = Number(value)
        }

        setBondInfo({
            ...bondInfo,
            [id]: value || 0
        })
    }

    function getToken(chain: Chain | undefined, type: string): NodeJS.Timeout | undefined {
        const isInvestment = type === "investmentToken";
        const contractAddressTmp = isInvestment ? bondInfo.investmentToken : bondInfo.interestToken;
        const setToken = isInvestment ? setInvestmentTokenInfo : setInterestTokenInfo

        const contractAddress = (contractAddressTmp || "").toLowerCase();
        if (!contractAddress || !chain) {
            setToken({} as any);
            return;
        }


        const requestToAPI = async () => {
            const params = {
                address,
                chainId: chain.id,
                contractAddresses: [contractAddress],
                returnBalance: Boolean(address)
            }
            const tokenInfoObject = await CloudAPI.getTokensDetailed({params})
            const tokenInfo = tokenInfoObject?.[contractAddress.toLowerCase()];
            if (tokenInfo) {
                setToken({...tokenInfo})
            } else {
                setToken({...token, unidentified: true})
            }
        }

        console.log('Getting token info', contractAddress)

        const token: TokenResponseDetailed = {
            _id: "",
            balance: 0,
            balanceClean: "",
            isVerified: false,
            isLoading: true,
            name: "",
            symbol: "",
            decimals: 0,
            icon: ""
        }


        requestToAPI();


        return setInterval(async () => {

            const params = {
                address,
                chainId: chain.id,
                contractAddresses: [contractAddress],
                returnBalance: Boolean(address)
            }
            const tokenInfoObject = await CloudAPI.getTokensDetailed({params})
            const tokenInfo = tokenInfoObject?.[contractAddress.toLowerCase()];
            if (tokenInfo) {
                setToken({...tokenInfo})
            } else {
                setToken({...token, unidentified: true})
            }
        }, 5000);

    }

    useEffect(() => {
        if (chain && ZCB_ISSUER_CONTRACTS[chain.id]) {
            getIssuerContractInfo(chain)
                .then(response => {
                    if (response) {
                        setAdditionalInfo({...additionalInfo, ...response})
                    }
                });
        }
    }, [chain])

    useEffect(() => {
        const timer = getToken(chain, "interestToken");
        return () => clearTimeout(timer)
    }, [chain, address, bondInfo.interestToken])

    useEffect(() => {
        const timer = getToken(chain, "investmentToken");
        return () => clearTimeout(timer)
    }, [chain, address, bondInfo.investmentToken])


    const totalRaised: number = (bondInfo.investmentTokenAmount || 0) * (bondInfo.total || 0);
    const totalInterest: number = (bondInfo.interestTokenAmount || 0) * (bondInfo.total || 0);

    return <>
        <main className={Styles.container}>
            <div className={Styles.bondContainer}>
                <div className={Styles.form}>
                    <div className={Styles.formTexts}>
                        <h2 className='text-2xl font-bold'>Begin Bond Creation</h2>
                        <span className="text-g text-sm">Initiate the issuance of your bonds. Set investment token, total bonds, interest token, and redeem lock period to shape your financial strategy</span>
                        <div className={Styles.formLine}/>
                    </div>

                    <div className="grid gap-4 w-full lg:grid-cols-2 sm:grid-cols-1">
                        <div className="flex flex-col justify-between gap-2">
                            <InfoBox info={InfoSections.Total}>
                                <span>Total</span>
                            </InfoBox>
                            <input type="number"
                                   className="placeholder:text-g2 px-4 py-3 bg-transparent border border-w1 border-solid rounded text-white w-full text-sm"
                                   autoFocus
                                   id='total'
                                   placeholder="Total bonds" onChange={onChange}/>
                        </div>
                        <RedeemLockPeriod bondsHandler={bondsHandler}/>
                        <div className="flex flex-col justify-between gap-2">
                            <InfoBox info={InfoSections.Investment}>
                                <span>Investment Token</span>
                            </InfoBox>
                            <input type="text"
                                   className="placeholder:text-g2 px-4 py-3 bg-transparent border border-w1 border-solid rounded text-white w-full text-sm"
                                   id="investmentToken"
                                   onChange={onChange}
                                   placeholder="Investment token contract address"/>
                        </div>

                        <div className="flex flex-col justify-between gap-2">
                            <InfoBox info={InfoSections.Interest}>
                                <span>Interest Token</span>
                            </InfoBox>
                            <input type="text"
                                   className="placeholder:text-g2 px-4 py-3 bg-transparent border border-w1 border-solid rounded text-white w-full text-sm"
                                   id="interestToken"
                                   onChange={onChange}
                                   placeholder="Interest token contract address"/>
                        </div>

                        <div className="flex flex-col justify-between gap-2">
                            <InfoBox info={InfoSections.InvestmentAmount}>
                                <span>Investment Amount</span>
                            </InfoBox>
                            <input type="number"
                                   className="placeholder:text-g2 px-4 py-3 bg-transparent border border-w1 border-solid rounded text-white w-full text-sm"
                                   id="investmentTokenAmount"
                                   onChange={onChange}
                                   placeholder="Investment amount per bond"/>
                        </div>

                        <div className="flex flex-col justify-between gap-2">
                            <InfoBox info={InfoSections.InterestAmount}>
                                <span className='w-max'>Interest Amount</span>
                            </InfoBox>
                            <input type="number"
                                   className="placeholder:text-g2 px-4 py-3 bg-transparent border border-w1 border-solid rounded text-white w-full text-sm"
                                   id="interestTokenAmount"
                                   onChange={onChange}
                                   placeholder="Interest amount per bond"/>
                        </div>

                    </div>

                    <div className="flex flex-col gap-2">
                        <p className="text-g3 text-xs">
                            By issuing bond you agree with our&nbsp;
                            <Link href={URLS.PrivacyPolicy} target="_blank"><u>Privacy policy</u></Link>
                            &nbsp;and&nbsp;
                            <Link href={URLS.TermsOfService} target="_blank"><u>Terms of use.</u></Link>
                        </p>
                        <button
                            className="flex justify-center gap-2 items-center border border-w1 py-3 p-4 w-full font-medium rounded hover:bg-white hover:text-black"
                            onClick={submit}> {isLoading && <Loading percent={70}/>} Issue bonds
                            {Boolean(additionalInfo.issuanceFeeForUI) &&
                                <span className='text-red-500'>({additionalInfo.issuanceFeeForUI})</span>}
                        </button>
                    </div>
                </div>
                <div className={Styles.form}>
                    <div className={join([Styles.formTexts, "lg:w-[400px] md:w-full"])}>
                        <h2 className='text-2xl font-bold'>Review Bond Details</h2>
                        <span className="text-g text-sm">Ensure accuracy and make any adjustments if needed.</span>
                        <div className={Styles.formLine}/>
                    </div>
                    <div className="flex flex-col justify-between gap-2 w-full text-sm lg:max-w-lg md:max-w-none">
                        <div className={Styles.assets}>
                            <div className={Styles.section}>
                                <TotalSVG/>
                                <span>Total:</span>
                            </div>
                            <span className='font-bold'>{bondInfo.total}</span>
                        </div>
                        <div className={Styles.assets}>
                            <div className={Styles.section}>
                                <TypeSVG/>
                                <span>Type:</span>
                            </div>
                            <InfoBox info={InfoSections.Type}>
                                <p className='font-bold text-end w-full'>ZCB(Zero Coupon Bond)</p>
                            </InfoBox>
                        </div>
                        <div className={Styles.assets}>
                            <div className={Styles.section}>
                                <ClockSVG/>
                                <span>Redeem Lock Period:</span>
                            </div>
                            <span
                                className='font-bold whitespace-nowrap'>{formatTime(bondInfo.redeemLockPeriod || 0, true) || 0}</span>
                        </div>
                    </div>

                    <div className='flex flex-col gap-2 w-full'>
                        <TokenDetails type={BondTokenInfo.Investment}
                                      additionalInfo={additionalInfo}
                                      total={totalRaised}
                                      tokenInfo={investmentTokenInfo}/>
                        <TokenDetails type={BondTokenInfo.Interest}
                                      additionalInfo={additionalInfo}
                                      total={totalInterest}
                                      tokenInfo={interestTokenInfo}/>
                    </div>


                </div>
            </div>
        </main>
    </>
}

function TokenDetails({tokenInfo, type, total, additionalInfo}: {
    tokenInfo: TokenResponseDetailed,
    type: string,
    total: number,
    additionalInfo: any
}) {

    if (!Object.keys(tokenInfo).length || tokenInfo?._id?.toLowerCase() === ZERO_ADDRESS) {
        return null;
    }

    const isLoading = tokenInfo?.isLoading && !tokenInfo.unidentified

    return <>
        <div className="flex flex-col gap-2 bg-b4 rounded px-4 py-3 lg:w-[400px] lg:max-w-lg md:w-full">
            {
                isLoading ?
                    <div className='flex justify-center items-center'><Loading/></div> :
                    <OperationDetails tokenInfo={tokenInfo} total={total} type={type}
                                      additionalInfo={additionalInfo}/>
            }
        </div>
    </>
}

function OperationDetails({tokenInfo, total, type, additionalInfo}: TokenDetails) {

    const isInterest = type === BondTokenInfo.Interest
    const icon = tokenInfo?.icon || "";
    const name = tokenInfo?.name || ""
    const symbol = tokenInfo?.symbol;
    const balance = tokenInfo?.balance;
    const balanceClean = tokenInfo?.balanceClean;
    const title = isInterest ? "Interest" : "Investment"
    const actionTitle = isInterest ? "Total Returned" : "Total Received"

    const info = {
        text: isInterest ? "Total Returned displays the sum of interest tokens to be distributed among bondholders." : "Total Received represents the amount of investment funds collected for your bonds.",
        url: URLS.FAQ_IOB
    }


    const token = {
        name,
        icon,
        balanceClean,
        balance,
        symbol,
        actionTitle,
        total,
        type
    }

    return <>
        <div className="flex items-center gap-2">
            <InfoBox info={info}>
                <span className='font-bold'>{title}</span>
            </InfoBox>
        </div>
        <div className="flex flex-col gap-2">
            <Token tokenInfo={tokenInfo} type={type} total={total} additionalInfo={additionalInfo}/>
        </div>
    </>
}

function Token({tokenInfo, type, total, additionalInfo}: {
    tokenInfo: TokenResponseDetailed,
    type: string,
    total: number,
    additionalInfo: IssuerContractInfo
}) {

    if (tokenInfo.unidentified) {
        return <NotIdentified/>
    }

    const icon = tokenInfo.icon || makeBlockie(tokenInfo._id);
    const name = tokenInfo.name || ""
    const symbol = tokenInfo.symbol;
    const balance = tokenInfo.balance;
    const balanceClean = Number(tokenInfo?.balanceClean);
    const title = type === BondTokenInfo.Interest ? "Interest" : "Investment"
    const actionTitle = type === BondTokenInfo.Interest ? "Total Returned" : "Total Received"

    const isInterest = type === BondTokenInfo.Interest
    const totalClassName = isInterest ? Styles.interestTotal : Styles.investmentTotal;
    const sign = isInterest ? '-' : '+';
    const normalizedCreationFee = additionalInfo.creationFeePercentage / 10
    const totalReceived = isInterest ? total : (total - (total * normalizedCreationFee) / 100)


    return <>
        <div className="flex items-center gap-2">
            <div className={Styles.tokenDetails}>
                <Image src={icon} alt={name} width={32} height={32} className='rounded-full'/>
                <div className="flex flex-col">
                    <div className='flex items-center gap-2'>
                        <p>{name}</p>
                        {tokenInfo.isVerified ? <VerifiedSVG/> : <WarningSVG/>}
                    </div>
                    {
                        Number.isFinite(balanceClean) &&
                        <span
                            className={Styles.secondaryText}>Balance: {format(Number(balanceClean))} {symbol}</span>
                    }
                </div>
            </div>
        </div>
        <div className={Styles.formLine}/>
        <div className='flex flex-col gap-0.5'>
            <div className='flex items-center gap-2'>
                <span className='font-bold'>{actionTitle}:</span>
                <span className={totalClassName}><b>{sign}{format(totalReceived)} {symbol}</b></span>
            </div>
            {!isInterest &&
                <span className='text-xs text-g'>We charge {normalizedCreationFee}% on every purchased bond.</span>}
        </div>
    </>
}

function NotIdentified() {
    const {chain} = useNetwork()

    return <>
        <div className="flex lg:items-center md:items-start gap-4 lg:max-w-lg md:max-w-none">
            <p className='text-sm'>
                Could not identify the token, make sure the contract is correct for
                <span className="text-red-500 font-bold"> {chain?.name} network</span>
            </p>
            <WarningSVG/>
        </div>
    </>
}


function RedeemLockPeriod({bondsHandler}: any) {
    const [bondInfo, setBondsInfo] = bondsHandler;

    const [timer, setTimer] = useState({
        hour: 0,
        day: 0,
        month: 0,
        year: 0
    })

    const change = (event: any) => {
        setTimer({
            ...timer,
            [event.target.id]: Number(event.target.value)
        })
    }

    const focusInnerInput = (event: Event | any) => {
        const input = event.currentTarget.querySelector('input');
        if (input) {
            input.focus();
        }
    }

    useEffect(() => {
        const action = setTimeout(() => {
            let total = 0
            total += (timer.hour || 0) * hourInSec
            total += (timer.day || 0) * dayInSec
            total += (timer.month || 0) * monthInSec
            total += (timer.year || 0) * yearInSec

            setBondsInfo({
                ...bondInfo,
                redeemLockPeriod: total
            })
        }, 100)

        return () => {
            clearTimeout(action)
        }
    }, [timer])


    return <>
        <div className="flex flex-col  gap-2 w-full">
            <InfoBox info={InfoSections.Redeem}>
                <span>Redeem</span>
            </InfoBox>
            <div className="flex items-center h-full gap-2">
                <div
                    className="flex flex-col items-center justify-center bg-transparent border border-w1 border-solid rounded text-white text-xs h-full"
                    onClick={focusInnerInput}>
                    <span className="text-g3">Hour</span>
                    <input type="number"
                           className={Styles.timeInput}
                           id='hour' defaultValue={timer.hour}
                           onChange={change}/>
                </div>
                <div
                    className="flex flex-col items-center justify-center bg-transparent border border-w1 border-solid rounded text-white text-xs h-full"
                    onClick={focusInnerInput}>
                    <span className={Styles.gray1}>Day</span>
                    <input type="number" className={Styles.timeInput} id='day' defaultValue={timer.day}
                           onChange={change}/>
                </div>
                <div
                    className="flex flex-col items-center justify-center bg-transparent border border-w1 border-solid rounded text-white text-xs h-full"
                    onClick={focusInnerInput}>
                    <span className={Styles.gray1}>Month</span>
                    <input type="number" className={Styles.timeInput} id='month' defaultValue={timer.month}
                           onChange={change}/>
                </div>
                <div
                    className="flex flex-col items-center justify-center bg-transparent border border-w1 border-solid rounded text-white text-xs h-full"
                    onClick={focusInnerInput}>
                    <span className={Styles.gray1}>Year</span>
                    <input type="number" className={Styles.timeInput} id='year' defaultValue={timer.year}
                           onChange={change}/>
                </div>
            </div>
        </div>
    </>
}
