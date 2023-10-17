import Styles from "./index.module.css";
import Image from "next/image";
import {useEffect, useState} from "react";
import {formatTime} from "@/modules/utils/dates";
import {BondInfo, TokenDetails} from "@/components/pages/bonds/pages/issue/type";
import {getTokenInfo} from "@/modules/web3/tokens";
import {useSelector} from "react-redux";
import Loading from "@/components/utils/loading";
import * as Web3Service from "@/modules/web3";
import {CHAIN_INFO, TxTypes, WalletTypes, ZERO_ADDRESS} from "@/modules/web3/constants";
import {decode} from "@/modules/web3/zcb";
import {openModal} from "@/store/redux/modal";
import {ModalTypes} from "@/store/redux/modal/constants";
import {toast} from "react-toastify";
import {format} from "@/modules/utils/numbers";
import WarningSVG from "../../../../../../public/svg/warning";
import InfoSVG from "../../../../../../public/svg/info";
import {RootState} from "@/store/redux/type";
import ClockSVG from "../../../../../../public/svg/clock";
import {join} from "@/modules/utils/styles";
import TypeSVG from "../../../../../../public/svg/type";
import TotalSVG from "../../../../../../public/svg/total";
import {URLS} from "@/modules/utils/urls";
import Link from "next/link";
import {TokenInfo} from "@/modules/web3/type";

const BondTokenInfo = {
    Investment: 'investmentToken',
    Interest: 'interestToken'
}

export default function Issue() {

    const account = useSelector((item: RootState) => item.account)
    const [bondInfo, setBondInfo] = useState({total: 0, redeemLockPeriod: 0} as BondInfo);

    const [investmentTokenInfo, setInvestmentTokenInfo] = useState({contractAddress: ZERO_ADDRESS} as TokenInfo)
    const [interestTokenInfo, setInterestTokenInfo] = useState({contractAddress: ZERO_ADDRESS} as TokenInfo)
    const bondsHandler = [bondInfo, setBondInfo]

    async function submit() {
        // todo add here the investmentTokenInfo and the interest one
        if (
            !bondInfo.investmentToken ||
            !bondInfo.interestToken ||
            !bondInfo.total ||
            !bondInfo.redeemLockPeriod ||
            !bondInfo.investmentTokenAmount ||
            !bondInfo.interestTokenAmount
        ) {
            toast.error(`Please fill all the empty inputs`)
            return;
        }


        if (investmentTokenInfo?.unidentified) {
            toast.error(`We could not identify Investment token`)
            return;
        }

        if (interestTokenInfo?.unidentified) {
            toast.error(`We could not identify Interest token`)
            return;
        }

        bondInfo.investmentTokenInfo = investmentTokenInfo;
        bondInfo.interestTokenInfo = interestTokenInfo;


        const transaction = await Web3Service.submitTransaction(WalletTypes.Metamask, TxTypes.IssueBond, bondInfo);
        if (transaction) {
            const decoded = decode(transaction);
            return openModal(ModalTypes.IssuedBondSuccess, {
                bondInfo,
                transaction,
                decoded
            })
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

    function getToken(type: string) {
        const isInvestment = type === "investmentToken"
        const contractAddressTmp = isInvestment ? bondInfo.investmentToken : bondInfo.interestToken;
        const setToken = isInvestment ? setInvestmentTokenInfo : setInterestTokenInfo

        const contractAddress = (contractAddressTmp || "").toLowerCase();
        if (!contractAddress) {
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

            const tokenInfo = await getTokenInfo(contractAddress, account.address);
            if (tokenInfo) {
                setToken({...tokenInfo})
            } else {
                setToken({...token, unidentified: true})
            }
        }, 1000);

        return timer;
    }

    useEffect(() => {
        const timer = getToken("interestToken");
        return () => clearTimeout(timer)
    }, [bondInfo.interestToken])

    useEffect(() => {
        const timer = getToken("investmentToken");
        return () => clearTimeout(timer)
    }, [bondInfo.investmentToken])

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
                            <span>Total</span>
                            <input type="number"
                                   className="placeholder:text-g2 px-4 py-3 bg-transparent border border-w1 border-solid rounded text-white w-full text-sm"
                                   autoFocus
                                   id='total'
                                   placeholder="Total bonds" onChange={onChange}/>
                        </div>
                        <RedeemLockPeriod bondsHandler={bondsHandler}/>
                        <div className="flex flex-col justify-between gap-2">
                            <span>Investment Token</span>
                            <input type="text"
                                   className="placeholder:text-g2 px-4 py-3 bg-transparent border border-w1 border-solid rounded text-white w-full text-sm"
                                   id="investmentToken"
                                   onChange={onChange}
                                   placeholder="Investment token contract address"/>
                        </div>

                        <div className="flex flex-col justify-between gap-2">
                            <span>Interest Token</span>
                            <input type="text"
                                   className="placeholder:text-g2 px-4 py-3 bg-transparent border border-w1 border-solid rounded text-white w-full text-sm"
                                   id="interestToken"
                                   onChange={onChange}
                                   placeholder="Interest token contract address"/>
                        </div>

                        <div className="flex flex-col justify-between gap-2">
                            <span>Investment Amount</span>
                            <input type="number"
                                   className="placeholder:text-g2 px-4 py-3 bg-transparent border border-w1 border-solid rounded text-white w-full text-sm"
                                   id="investmentTokenAmount"
                                   onChange={onChange}
                                   placeholder="Investment amount per bond"/>
                        </div>

                        <div className="flex flex-col justify-between gap-2">
                            <span>Interest Amount</span>
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
                        <button className={Styles.submit} onClick={submit}>Issue bonds</button>
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
                            <span className='font-bold'>ZCB(Zero Coupon Bond)</span>
                        </div>
                        <div className={Styles.assets}>
                            <div className={Styles.section}>
                                <ClockSVG/>
                                <span>Redeem Lock Period:</span>
                            </div>
                            <span className='font-bold'>{formatTime(bondInfo.redeemLockPeriod || 0, true) || 0}</span>
                        </div>
                    </div>

                    <div className='flex flex-col gap-2 max-w-sm'>
                        <TokenDetails type={BondTokenInfo.Investment}
                                      total={totalRaised}
                                      tokenInfo={investmentTokenInfo}/>
                        <TokenDetails type={BondTokenInfo.Interest}
                                      total={totalInterest}
                                      tokenInfo={interestTokenInfo}/>
                    </div>


                </div>
            </div>
        </main>
    </>
}

function TokenDetails({tokenInfo, type, total}: { tokenInfo: TokenInfo, type: string, total: number }) {

    if (!tokenInfo || tokenInfo.contractAddress === ZERO_ADDRESS) {
        return null;
    }

    const isLoading = tokenInfo?.isLoading && !tokenInfo.unidentified

    return <>
        <div className="flex flex-col gap-2 bg-b4 rounded px-4 py-3 max-w-lg">
            {
                isLoading ?
                    <div className={Styles.loader}><Loading/></div> :
                    <OperationDetails tokenInfo={tokenInfo} total={total} type={type}/>
            }
        </div>
    </>
}

function OperationDetails({tokenInfo, total, type}: TokenDetails) {

    const icon = tokenInfo?.icon || "";
    const name = tokenInfo?.name || ""
    const symbol = tokenInfo?.symbol;
    const balance = tokenInfo?.balance;
    const balanceClean = tokenInfo?.balanceClean;
    const title = type === BondTokenInfo.Interest ? "Interest" : "Investment"
    const actionTitle = type === BondTokenInfo.Interest ? "Total Interest" : "Total Investment"

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
            {!tokenInfo?.unidentified ? <Token token={token}/> : <NotIdentified/>}
        </div>
    </>
}

function Token({token}: any) {
    const {name, icon, balanceClean, symbol, actionTitle, total, type} = token;

    const isInterest = type === BondTokenInfo.Interest
    const totalClassName = isInterest ? Styles.interestTotal : Styles.investmentTotal;
    const sign = isInterest ? '-' : '+';

    const [isWarning, setWarning] = useState(false);
    const handleError = () => setWarning(true);

    return <>
        <div className="flex items-center gap-2">
            <div className={Styles.tokenDetails}>
                <Image src={icon} alt={name} width={32} height={32} onError={handleError}/>
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
        <div className='flex items-center gap-2'>
            <span className='font-bold'>{actionTitle}:</span>
            <span className={totalClassName}><b>{sign}{format(total)} {symbol}</b></span>
        </div>
    </>
}

function NotIdentified() {

    const account = useSelector((item: RootState) => item.account)
    const chainInfo = CHAIN_INFO[account.chainId]

    return <>
        <div className="flex items-center gap-4">
            <p className='text-sm break-words'>
                Could not identify the token, make sure the contract is correct for
                <span className="text-rl-1 font-bold"> {chainInfo.chainName} network</span>
            </p>
            <WarningSVG/>
        </div>
    </>
}


function RedeemLockPeriod({bondsHandler}: any) {
    const [bondInfo, setBondsInfo] = bondsHandler;

    const hourInSec = 60 * 60
    const dayInSec = 24 * hourInSec
    const monthInSec = 30 * dayInSec
    const yearInSec = 365 * dayInSec

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
            total += timer.hour * hourInSec
            total += timer.day * dayInSec
            total += timer.month * monthInSec
            total += timer.year * yearInSec

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
            <span>Redeem</span>
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