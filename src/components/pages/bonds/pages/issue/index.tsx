import Styles from "./index.module.css";
import Image from "next/image";
import {ReactEventHandler, useEffect, useState} from "react";
import {formatTime} from "@/modules/utils/dates";
import {BondInfo, TokenDetails} from "@/components/pages/bonds/pages/issue/type";
import {getTokenInfo} from "@/modules/web3/tokens";
import {useSelector} from "react-redux";
import Loading from "@/components/utils/loading";
import {submitTransaction} from "@/modules/web3";
import {CHAIN_INFO, DEFAULT_CHAIN_ID, TxTypes, WalletTypes} from "@/modules/web3/constants";
import {decode} from "@/modules/web3/zcb";
import {openModal} from "@/store/redux/modal";
import {ModalTypes} from "@/store/redux/modal/constants";
import {TokenInfo} from "@/modules/web3/type";
import {toast} from "react-toastify";
import {format} from "@/modules/utils/numbers";
import WarningSVG from "../../../../../../public/svg/warning";
import InfoSVG from "../../../../../../public/svg/info";
import {RootState} from "@/store/redux/type";

const BondTokenInfo = {
    Investment: 'investmentToken',
    Interest: 'interestToken'
}

export default function Issue() {

    const account = useSelector((item: RootState) => item.account)
    const [bondInfo, setBondInfo] = useState({} as BondInfo);
    const [tokens, setTokens] = useState({} as { [key: string]: TokenInfo })

    const investmentTokenInfo = tokens[bondInfo.investmentToken?.toLowerCase() || ""]
    const interestTokenInfo = tokens[bondInfo.interestToken?.toLowerCase() || ""]

    async function submit() {
        // todo add here the investmentTokenInfo and the interest one
        if (
            !bondInfo.investmentToken ||
            !bondInfo.interestToken ||
            !bondInfo.total ||
            !bondInfo.redeemLockPeriod ||
            !bondInfo.investmentTokenAmount ||
            !bondInfo.interestTokenAmount) {
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
            [id]: value
        })
    }

    function getToken(contractAddressTmp?: string) {
        if (!contractAddressTmp) {
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
            <h1>Issue Bonds</h1>
            <div className={Styles.bondContainer}>
                <div className={Styles.form}>

                    <div className={Styles.assets}>
                        <div className={Styles.formContainer}>
                            <input type="number" className={Styles.input}
                                   autoFocus
                                   id='total'
                                   placeholder="Total bonds" onChange={onChange}/>
                        </div>
                        <div className={Styles.formContainer}>
                            <input type="number" className={Styles.input}
                                   id='redeemLockPeriod'
                                   placeholder="Reedeem lock period in seconds" onChange={onChange}/>
                            {Boolean(bondInfo.redeemLockPeriod) &&
                                <span
                                    className={Styles.secondaryText}>{formatTime(bondInfo.redeemLockPeriod || 0)}</span>}
                        </div>
                    </div>

                    <div className={Styles.assets}>
                        <div className={Styles.formContainer}>
                            <input type="text" className={Styles.input}
                                   id="investmentToken"
                                   onChange={onChange}
                                   placeholder="Investment token"/>
                            <input type="number" className={Styles.input}
                                   id="investmentTokenAmount"
                                   onChange={onChange}
                                   placeholder="Investment amount per bond"/>
                        </div>

                        <div className={Styles.formContainer}>
                            <input type="text" className={Styles.input}
                                   id="interestToken"
                                   onChange={onChange}
                                   placeholder="Interest token"/>
                            <input type="number" className={Styles.input}
                                   id="interestTokenAmount"
                                   onChange={onChange}
                                   placeholder="Interest amount per bond"/>
                        </div>
                    </div>

                    <div className={Styles.assets}>
                        <button className={Styles.submit} onClick={submit}>Issue bonds</button>
                    </div>
                </div>
                <div className={Styles.bondInfo}>
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
                    <div className={Styles.loader}>
                        <Loading/>
                    </div> :
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
    const title = type === BondTokenInfo.Interest ? "Interest Token Info" : "Investment Token Info"
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

    const isInterest = type  === BondTokenInfo.Interest
    const totalClassName = isInterest ? Styles.interestTotal: Styles.investmentTotal;
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