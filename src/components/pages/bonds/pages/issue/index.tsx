import Styles from "./index.module.css";
import Image from "next/image";
import {ChangeEventHandler, EventHandler, useEffect, useRef, useState} from "react";
import {formatTime} from "@/modules/utils/dates";
import {BondInfo, TokenDetails} from "@/components/pages/bonds/pages/issue/type";
import {getTokenInfo} from "@/modules/web3/tokens";
import {useSelector} from "react-redux";
import Loading from "@/components/utils/loading";
import {submitTransaction} from "@/modules/web3";
import {CHAIN_INFO, TxTypes, WalletTypes} from "@/modules/web3/constants";
import {decode} from "@/modules/web3/zcb";
import {openModal} from "@/store/redux/modal";
import {ModalTypes} from "@/store/redux/modal/constants";
import {TokenInfo} from "@/modules/web3/type";
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

const BondTokenInfo = {
    Investment: 'investmentToken',
    Interest: 'interestToken'
}

export default function Issue() {

    const account = useSelector((item: RootState) => item.account)
    const [bondInfo, setBondInfo] = useState({
        total: 0,
        redeemLockPeriod: 0
    } as BondInfo);
    const [tokens, setTokens] = useState({} as { [key: string]: TokenInfo })

    const bondsHandler = [bondInfo, setBondInfo]

    const investmentTokenInfo = bondInfo.investmentToken ? tokens[bondInfo?.investmentToken?.toLowerCase() || ""] : undefined;
    const interestTokenInfo = bondInfo.interestToken ? tokens[bondInfo?.interestToken?.toLowerCase() || ""] : undefined

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


        bondInfo.investmentTokenInfo = investmentTokenInfo;
        bondInfo.interestTokenInfo = interestTokenInfo;


        const transaction = await submitTransaction(WalletTypes.Metamask, TxTypes.IssueBond, bondInfo);
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

    function getToken(contractAddressTmp?: string) {
        if (!contractAddressTmp || tokens[contractAddressTmp.toLowerCase()]) {
            return;
        }

        const contractAddress = contractAddressTmp.toLowerCase();

        setTokens({
            ...tokens,
            [contractAddress]: {isLoading: true}
        })

        const timer = setTimeout(async () => {
            const tokenInfo = await getTokenInfo(contractAddress, account.address);
            const tokensTmp = {...tokens};

            if (tokenInfo) {
                tokensTmp[contractAddress] = tokenInfo
            } else {
                tokensTmp[contractAddress] = {
                    unidentified: true
                }
            }

            setTokens({
                ...tokensTmp
            })

        }, 1500);

        return timer;
    }

    useEffect(() => {
        const timer = getToken(bondInfo.interestToken);

        return () => {
            clearTimeout(timer);
        };
    }, [bondInfo.interestToken])

    useEffect(() => {
        const timer = getToken(bondInfo.investmentToken);

        return () => {
            clearTimeout(timer);
        };
    }, [bondInfo.investmentToken])

    const totalRaised: number = (bondInfo.investmentTokenAmount || 0) * (bondInfo.total || 0);
    const totalInterest: number = (bondInfo.interestTokenAmount || 0) * (bondInfo.total || 0);


    return <>
        <main className={Styles.container}>

            <div className={Styles.bondContainer}>
                <div className={Styles.form}>
                    <div className={Styles.formTexts}>
                        <h2>Begin Bond Creation</h2>
                        <span className={Styles.gray}>Initiate the issuance of your bonds. Set investment token, total bonds, interest token, and redeem lock period to shape your financial strategy</span>
                        <div className={Styles.formLine}/>
                    </div>

                    <div className={Styles.inputs}>
                        <div className={Styles.box}>
                            <span>Total</span>
                            <input type="number" className={Styles.input}
                                   autoFocus
                                   id='total'
                                   placeholder="Total bonds" onChange={onChange}/>
                        </div>
                        <RedeemLockPeriod bondsHandler={bondsHandler}/>

                        <div className={Styles.box}>
                            <span>Investment Token</span>
                            <input type="text" className={Styles.input}
                                   id="investmentToken"
                                   onChange={onChange}
                                   placeholder="Investment token contract address"/>
                        </div>

                        <div className={Styles.box}>
                            <span>Interest Token</span>
                            <input type="text" className={Styles.input}
                                   id="interestToken"
                                   onChange={onChange}
                                   placeholder="Interest token contract address"/>
                        </div>

                        <div className={Styles.box}>
                            <span>Investment Amount</span>
                            <input type="number" className={Styles.input}
                                   id="investmentTokenAmount"
                                   onChange={onChange}
                                   placeholder="Investment amount per bond"/>
                        </div>

                        <div className={Styles.box}>
                            <span>Interest Amount</span>
                            <input type="number" className={Styles.input}
                                   id="interestTokenAmount"
                                   onChange={onChange}
                                   placeholder="Interest amount per bond"/>
                        </div>

                    </div>

                    <div className={Styles.submitContainer}>
                        <p className={Styles.gray1}>
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
                        <h2>Review Bond Details</h2>
                        <span className={Styles.gray}>Ensure accuracy and make any adjustments if needed.</span>
                        <div className={Styles.formLine}/>
                    </div>

                    <div className={join([Styles.box, Styles.bondDetailsMax])}>
                        <div className={Styles.assets}>
                            <div className={Styles.section}>
                                <TotalSVG/>
                                <span>Total:</span>
                            </div>
                            <span>{bondInfo.total}</span>
                        </div>
                        <div className={Styles.assets}>
                            <div className={Styles.section}>
                                <TypeSVG/>
                                <span>Type:</span>
                            </div>
                            <span>ZCB(Zero Coupon Bond)</span>
                        </div>
                        <div className={Styles.assets}>
                            <div className={Styles.section}>
                                <ClockSVG/>
                                <span>R.L.P:</span>
                            </div>
                            <span>{formatTime(bondInfo.redeemLockPeriod || 0, true) || 0}</span>
                        </div>
                    </div>

                    <TokenDetails type={BondTokenInfo.Investment}
                                  total={totalRaised}
                                  tokenInfo={investmentTokenInfo}/>
                    <TokenDetails type={BondTokenInfo.Interest}
                                  total={totalInterest}
                                  tokenInfo={interestTokenInfo}/>


                </div>
            </div>
        </main>
    </>
}

function TokenDetails({tokenInfo, type, total}: TokenDetails) {

    if (!tokenInfo) {
        return null;
    }

    return <>
        <div className={Styles.tokenInfo}>
            {
                tokenInfo?.isLoading ?
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
        url: "https://docs.amet.finance/v1/" // todo update here
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
        <div className={Styles.tokenDetails}>
            <span>{title}</span>
            <InfoSVG info={info}/>
        </div>
        <div className={Styles.operationDetails}>
            {!tokenInfo?.unidentified ? <Token token={token}/> : <NotIdentified token={token}/>}
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
        <div className={Styles.tokenDetails}>
            <div className={Styles.tokenDetails}>
                <Image src={icon} alt={name} width={50} height={50} onError={handleError}/>
                <div className={Styles.token}>
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
        <p>{actionTitle}: <span className={totalClassName}><b>{sign}{format(total)} {symbol}</b></span></p>
    </>
}

function NotIdentified({token}: any) {

    const account = useSelector((item: RootState) => item.account)
    const chainInfo = CHAIN_INFO[account.chain]

    return <>
        <div className={Styles.tokenDetails}>
            <p>
                <b>Could not identify the token, make sure the contract is correct for <span
                    className={Styles.chainError}>{chainInfo.chainName} network</span></b>
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
        <div className={Styles.box}>
            <span>Redeem</span>
            <div className={Styles.section}>
                <div className={Styles.timeBox} onClick={focusInnerInput}>
                    <span className={Styles.gray1}>Hour</span>
                    <input type="number" className={Styles.timeInput} id='hour' defaultValue={timer.hour}
                           onChange={change}/>
                </div>
                <div className={Styles.timeBox} onClick={focusInnerInput}>
                    <span className={Styles.gray1}>Day</span>
                    <input type="number" className={Styles.timeInput} id='day' defaultValue={timer.day}
                           onChange={change}/>
                </div>
                <div className={Styles.timeBox} onClick={focusInnerInput}>
                    <span className={Styles.gray1}>Month</span>
                    <input type="number" className={Styles.timeInput} id='month' defaultValue={timer.month}
                           onChange={change}/>
                </div>
                <div className={Styles.timeBox} onClick={focusInnerInput}>
                    <span className={Styles.gray1}>Year</span>
                    <input type="number" className={Styles.timeInput} id='year' defaultValue={timer.year}
                           onChange={change}/>
                </div>
            </div>
        </div>
    </>
}