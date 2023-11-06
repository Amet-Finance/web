import Styles from "./index.module.css";
import Image from "next/image";
import {useEffect, useState} from "react";
import {dayInSec, formatTime, hourInSec, monthInSec, yearInSec} from "@/modules/utils/dates";
import {BondInfo, TokenDetails} from "@/components/pages/bonds/pages/issue/type";
import {getTokenInfo} from "@/modules/web3/tokens";
import Loading from "@/components/utils/loading";
import {TxTypes, ZERO_ADDRESS} from "@/modules/web3/constants";
import {openModal} from "@/store/redux/modal";
import {ModalTypes} from "@/store/redux/modal/constants";
import {toast} from "react-toastify";
import {format} from "@/modules/utils/numbers";
import WarningSVG from "../../../../../../public/svg/warning";
import InfoSVG from "../../../../../../public/svg/info";
import ClockSVG from "../../../../../../public/svg/clock";
import {join} from "@/modules/utils/styles";
import TypeSVG from "../../../../../../public/svg/type";
import TotalSVG from "../../../../../../public/svg/total";
import {URLS} from "@/modules/utils/urls";
import Link from "next/link";
import {IssuerContractInfo, TokenInfo} from "@/modules/web3/type";
import {Chain, useAccount, useNetwork, useSendTransaction} from "wagmi";
import {getContractInfoByType, trackTransaction} from "@/modules/web3";
import {useWeb3Modal} from "@web3modal/wagmi/react";
import {toBN} from "@/modules/web3/util";
import {getIssuerContractInfo} from "@/modules/web3/zcb";
import InfoBox from "@/components/utils/info-box";

const BondTokenInfo = {
    Investment: 'investmentToken',
    Interest: 'interestToken'
}

const InfoSections = {
    Total: {
        text: "The total number of bonds to issue",
        link: URLS.FAQ_IOB,
        isBlank: true
    },
    Investment: {
        text: "The contract address of the investment token.",
        link: URLS.FAQ_IOB,
        isBlank: true
    },
    Interest: {
        text: "The contract address of the interest token.",
        link: URLS.FAQ_IOB,
        isBlank: true
    },
    InvestmentAmount: {
        text: "The price per bond in the investment token.",
        link: URLS.FAQ_IOB,
        isBlank: true
    },
    InterestAmount: {
        text: "The total return per bond in the interest token.",
        link: URLS.FAQ_IOB,
        isBlank: true
    },
    Redeem: {
        text: "The duration after which bonds can be redeemed.",
        link: URLS.FAQ_IOB,
        isBlank: true
    },
    Type: {
        text: "The bond type. Zero Coupon Bonds (ZCB) have no periodic interest payments; interest is paid at bond redemption.",
        link: URLS.FAQ_ZCB,
        isBlank: true
    }
}

export default function Issue() {

    const account = useAccount();
    const {chain} = useNetwork();
    const {open} = useWeb3Modal()

    const [additionalInfo, setAdditionalInfo] = useState({} as IssuerContractInfo)
    const [bondInfo, setBondInfo] = useState({total: 0, redeemLockPeriod: 0} as BondInfo);

    const [investmentTokenInfo, setInvestmentTokenInfo] = useState({contractAddress: ZERO_ADDRESS} as TokenInfo)
    const [interestTokenInfo, setInterestTokenInfo] = useState({contractAddress: ZERO_ADDRESS} as TokenInfo)
    const bondsHandler = [bondInfo, setBondInfo]


    const contractInfo = getContractInfoByType(chain, TxTypes.IssueBond, {bondInfo, additionalInfo})

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

            if (!account.address) {
                return open()
            }

            bondInfo.investmentTokenInfo = investmentTokenInfo;
            bondInfo.interestTokenInfo = interestTokenInfo;


            const response = await sendTransactionAsync?.()
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

    function getToken(chain: Chain | undefined, type: string) {
        const isInvestment = type === "investmentToken"
        const contractAddressTmp = isInvestment ? bondInfo.investmentToken : bondInfo.interestToken;
        const setToken = isInvestment ? setInvestmentTokenInfo : setInterestTokenInfo

        const contractAddress = (contractAddressTmp || "").toLowerCase();
        if (!contractAddress || !chain) {
            return;
        }

        console.log('Getting token info', contractAddress)

        const token: TokenInfo = {
            contractAddress: contractAddress,
            isLoading: true,
            name: "",
            symbol: "",
            decimals: 0,
            icon: ""
        }

        setToken({...token})

        const timer = setInterval(async () => {

            const tokenInfo = await getTokenInfo(chain, contractAddress, account.address);
            if (tokenInfo) {
                setToken({...tokenInfo})
            } else {
                setToken({...token, unidentified: true})
            }
        }, 1000);

        return timer;
    }

    useEffect(() => {
        if (chain) {
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
    }, [chain, account.address, bondInfo.interestToken])

    useEffect(() => {
        const timer = getToken(chain, "investmentToken");
        return () => clearTimeout(timer)
    }, [chain, account.address, bondInfo.investmentToken])


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
                    <div className={Styles.formTexts}>
                        <h2 className='text-2xl font-bold'>Review Bond Details</h2>
                        <span className="text-g text-sm">Ensure accuracy and make any adjustments if needed.</span>
                        <div className={Styles.formLine}/>
                    </div>

                    <div className={join([Styles.box, Styles.bondDetailsMax])}>
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

                    <div className='flex flex-col gap-2 max-w-sm'>
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
    tokenInfo: TokenInfo,
    type: string,
    total: number,
    additionalInfo: any
}) {

    if (!tokenInfo || tokenInfo.contractAddress === ZERO_ADDRESS) {
        return null;
    }

    const isLoading = tokenInfo?.isLoading && !tokenInfo.unidentified

    return <>
        <div className="flex flex-col gap-2 bg-b4 rounded px-4 py-3 max-w-lg">
            {
                isLoading ?
                    <div className={Styles.loader}><Loading/></div> :
                    <OperationDetails tokenInfo={tokenInfo} total={total} type={type} additionalInfo={additionalInfo}/>
            }
        </div>
    </>
}

function OperationDetails({tokenInfo, total, type, additionalInfo}: TokenDetails) {

    const icon = tokenInfo?.icon || "";
    const name = tokenInfo?.name || ""
    const symbol = tokenInfo?.symbol;
    const balance = tokenInfo?.balance;
    const balanceClean = tokenInfo?.balanceClean;
    const title = type === BondTokenInfo.Interest ? "Interest" : "Investment"
    const actionTitle = type === BondTokenInfo.Interest ? "Total Returned" : "Total Received"

    const info = {
        title: "Learn more about Bonds",
        url: URLS.Docs // todo update here
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
            <span className='font-bold'>{title}</span>
            <InfoSVG info={info}/>
        </div>
        <div className="flex flex-col gap-2">
            {!tokenInfo?.unidentified ? <Token token={token} additionalInfo={additionalInfo}/> : <NotIdentified/>}
        </div>
    </>
}

function Token({token, additionalInfo}: { token: any, additionalInfo: IssuerContractInfo }) {
    const {name, icon, balanceClean, symbol, actionTitle, total, type} = token;

    const isInterest = type === BondTokenInfo.Interest
    const totalClassName = isInterest ? Styles.interestTotal : Styles.investmentTotal;
    const sign = isInterest ? '-' : '+';
    const normalizedCreationFee = additionalInfo.creationFeePercentage / 100
    const totalReceived = isInterest ? total : (total - (total * normalizedCreationFee) / 100)

    const [isWarning, setWarning] = useState(false);


    function Img() {

        const iconUrl = isWarning ? "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAAAXNSR0IArs4c6QAAA8lJREFUeF7t3bFtFUEUheF9NIAsKqAKJBeCkEgQIanrICVEJCQE7oOMDqiBBgBRAu9b6frq/c7Pzsy5/565a69nLz/fPPw54OfX98+gPo4PH5+Rfrv408NvWsLzV+9JfwkA8o/FAVACEEQlANk3Ly4BSgCisAQg++bFJUAJQBSWAGTfvLgEKAGIwhKA7JsXlwAlAFFYApB98+ISoAQgCksAsm9eXAKUAERhCUD2zYvHE+DHyzt6H+DW/54/jZACdAmA6RLa+AFg/q1XB8D6EtoCAsD8W68OgPUltAUEgPm3Xh0A60toCwgA82+9OgDWl9AWEADm33p1AKwvoS0gAMy/9eoAWF9CW0AAmH/r1QGwvoS2AAbg/vEFvQ+gE9D3Cb5+e2cOovrt6y90hWn/LgFA9TsCAE+4KAHshBD1rwSwACgBpvewegA7Y6kEKAF6ChAGagJrAoWfY3oLbQug8h01gdME1wTWBOI9bPJ6gHoAImg6QesBqHz1AONdbD1APQDewyavB6gHIILW9wAawXoHkftPQDztHzeB0wt4AjWkKUz7FwBUPhcHAL5S5SWYvUIABAARqD1UWwDZ7+ISoAQgikoAsm9eXAKUAERhCUD2zYtLgBKAKCwByL55cQlQAhCFJQDZNy8uAUoAorAEIPvmxeMJMH1c/LQBisD0/PWFkvHvBUwbGADDXwwJgNkTRkoAjIBpgNsChp8iAgA/+zZtIAbAMT3/EqAEIIbrAci+owTQU6qmIxTrHwABYAdV6q9y6wHqASjE6gHIvnqAoy2gLYDuoZrAfhVMAGkTRYMfbQFtAXhcvQK8/ilAF6A9iCbA9Px1/PGnAF1AANhx8wGAETANsI4fAAFwR98M0ghWgnV8rP/4MXnqXwmABGgBFGAdPwACoC1AGNA7sAQYPmhSiv9PGwD4TuC0gQEw/H8BAWCHPat/NYEYAVqAeoB6AEJQASwByP6aQP5zsBKsEYr17ylACxAAN94E6h1463q9gcZ7gFsvoK4/ANTB5foAWF5AnX4AqIPL9QGwvIA6/QBQB5frA2B5AXX6AaAOLtcHwPIC6vQDQB1crg+A5QXU6QeAOrhcHwDLC6jTDwB1cLk+AJYXUKfPANw/vqD/DZxegI4/rdcXanT+/O1gnYASrONP6wMA3wqeLqCOHwABoAyRvi2A7HNxCVACOEVwhRIAzDtDWgKUAGdwdPU1SoCrrTtHWAKUAOeQdOVVSoArjTtLVgKUAGexdNV1SoCrbDtPVAKUAOfRdMWVSoArTDtTUgKUAGfy9N/X+gt78wptEKuW+wAAAABJRU5ErkJggg==" : icon
        const handleError = () => setWarning(true);

        return <>
            <Image src={iconUrl} alt={name} width={32} height={32} onError={handleError} className='rounded-full'/>
        </>
    }

    return <>
        <div className="flex items-center gap-2">
            <div className={Styles.tokenDetails}>
                <Img/>
                <div className="flex flex-col">
                    <div className={Styles.tokenDetails}>
                        <p>{name}</p>
                        {isWarning && <WarningSVG/>}
                    </div>
                    {Boolean(balanceClean) &&
                        <span className={Styles.secondaryText}>Balance: {format(Number(balanceClean))} {symbol}</span>}
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
        <div className="flex items-center gap-4">
            <p className='text-sm break-words'>
                Could not identify the token, make sure the contract is correct for
                <span className="text-rl-1 font-bold"> {chain?.name} network</span>
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
