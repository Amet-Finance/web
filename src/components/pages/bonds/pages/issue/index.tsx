import Styles from "./index.module.css";
import {useEffect, useState} from "react";
import {formatTime} from "@/modules/utils/dates";
import {BondInfo, TokenDetails} from "@/components/pages/bonds/pages/issue/type";
import {getTokenInfo} from "@/modules/web3/tokens";
import {useSelector} from "react-redux";
import {Account} from "@/store/redux/account/type";
import Loading from "@/components/utils/loading";
import {submitTransaction} from "@/modules/web3";
import {TxTypes, WalletTypes} from "@/modules/web3/constants";
import {decode} from "@/modules/web3/zcb";
import {openModal} from "@/store/redux/modal";
import {ModalTypes} from "@/store/redux/modal/constants";

const BondTokenInfo = {
    Investment: 'Investment token',
    Interest: 'Interest token'
}

export default function Issue() {

    const account: Account = useSelector((item: any) => item.account)
    const [bondInfo, setBondInfo] = useState({} as BondInfo);

    async function submit() {
        const transaction = await submitTransaction(WalletTypes.Metamask, TxTypes.IssueBond, bondInfo);
        if(transaction) {
            const decoded = decode(transaction);

            return openModal(ModalTypes.IssuedBondSuccess, {
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

    useEffect(() => {

        if (!bondInfo.interestToken) {
            delete bondInfo.interestTokenInfo;
            return setBondInfo({
                ...bondInfo
            })
        }

        setBondInfo({
            ...bondInfo,
            interestTokenInfo: {isLoading: true}
        })

        const timer = setTimeout(() => {
            if (bondInfo.interestToken) {
                getTokenInfo(bondInfo.interestToken, account.address)
                    .then(response => {
                        setBondInfo({
                            ...bondInfo,
                            interestTokenInfo: response
                        })
                    })
                    .catch(error => {
                        delete bondInfo.interestTokenInfo;
                        setBondInfo({
                            ...bondInfo
                        })
                    })
            }
        }, 3000);

        return () => {
            clearTimeout(timer);
        };
    }, [bondInfo.interestToken])

    useEffect(() => {

        if (!bondInfo.investmentToken) {
            delete bondInfo.investmentTokenInfo;
            return setBondInfo({
                ...bondInfo
            })
        }

        setBondInfo({
            ...bondInfo,
            investmentTokenInfo: {isLoading: true}
        })

        const timer = setTimeout(() => {
            if (bondInfo.investmentToken) {
                getTokenInfo(bondInfo.investmentToken, account.address)
                    .then(response => {
                        setBondInfo({
                            ...bondInfo,
                            investmentTokenInfo: response
                        })
                    })
                    .catch(error => {
                        delete bondInfo.investmentTokenInfo;
                        setBondInfo({
                            ...bondInfo
                        })
                    })
            }
        }, 3000)

        return () => {
            clearTimeout(timer);
        };
    }, [bondInfo.investmentToken])

    const totalRaised: number = (bondInfo.investmentTokenAmount || 0) * (bondInfo.total || 0);
    const totalInterest: number = (bondInfo.interestTokenAmount || 0) * (bondInfo.total || 0);

    return <>
        <main className={Styles.container}>
            <h1>Issue on-chain bonds</h1>
            <div className={Styles.bondContainer}>
                <div className={Styles.form}>

                    <div className={Styles.assets}>
                        <div className={Styles.formContainer}>
                            <input type="number" className={Styles.input}
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
                                  isLoading={Boolean(bondInfo.investmentTokenInfo?.isLoading)}
                                  tokenInfo={bondInfo.investmentTokenInfo}/>
                    <TokenDetails type={BondTokenInfo.Interest}
                                  total={totalInterest}
                                  isLoading={Boolean(bondInfo.interestTokenInfo?.isLoading)}
                                  tokenInfo={bondInfo.interestTokenInfo}/>
                </div>
            </div>
        </main>
    </>
}

function TokenDetails({tokenInfo, isLoading, type, total}: TokenDetails) {

    if (!tokenInfo) {
        return null;
    }

    return <>
        <div className={Styles.tokenInfo}>
            <span>{type}</span>
            {isLoading ? <Loading/> :
                <OperationDetails tokenInfo={tokenInfo} total={total} isLoading={isLoading} type={type}/>}
        </div>
    </>
}

function OperationDetails({tokenInfo, total, type}: TokenDetails) {
    return <>
        <div className={Styles.operationDetails}>
            <div className={Styles.tokenDetails}>
                <div className={Styles.tokenDetails}>
                    <img src={tokenInfo?.icon} alt="" width={50} height={50}/>
                    <p>{tokenInfo?.name}
                        <span>({tokenInfo?.symbol})</span>
                    </p>
                </div>
                {Boolean(tokenInfo?.balance) && <span>{(tokenInfo?.balance || 0) / 10 ** 18}</span>}
            </div>
            <span>Total: {total} {tokenInfo?.symbol}</span>
        </div>
    </>
}