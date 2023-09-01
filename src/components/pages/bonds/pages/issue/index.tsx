import Styles from "./index.module.css";
import Image from "next/image";
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
import {TokenInfo} from "@/modules/web3/type";
import {toast} from "react-toastify";

const BondTokenInfo = {
    Investment: 'Investment token',
    Interest: 'Interest token'
}

export default function Issue() {

    const account: Account = useSelector((item: any) => item.account)
    const [bondInfo, setBondInfo] = useState({} as BondInfo);
    const [tokens, setTokens] = useState({} as { [key: string]: TokenInfo })

    const investmentTokenInfo = tokens[bondInfo.investmentToken?.toLowerCase() || ""]
    const interestTokenInfo = tokens[bondInfo.interestToken?.toLowerCase() || ""]

    async function submit() {
        // todo add here the investmentTokenInfo and the interest one
        if (!bondInfo.investmentToken || !bondInfo.interestToken) {
            // toast add here
            toast.error(`Please fill all the inputs`)
            return;
        }

        bondInfo.investmentTokenInfo = investmentTokenInfo;
        bondInfo.interestTokenInfo = interestTokenInfo;


        const transaction = await submitTransaction(WalletTypes.Metamask, TxTypes.IssueBond, bondInfo);
        if (transaction) {
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
                delete tokensTmp[contractAddress]
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

    console.log(tokens);

    return <>
        <main className={Styles.container}>
            <h1>Issue on-chain bonds</h1>
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
                                  isLoading={Boolean(investmentTokenInfo?.isLoading)}
                                  tokenInfo={investmentTokenInfo}/>
                    <TokenDetails type={BondTokenInfo.Interest}
                                  total={totalInterest}
                                  isLoading={Boolean(interestTokenInfo?.isLoading)}
                                  tokenInfo={interestTokenInfo}/>
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
            {
                isLoading ?
                    <Loading/> :
                    <OperationDetails tokenInfo={tokenInfo} total={total} isLoading={isLoading} type={type}/>
            }
        </div>
    </>
}

function OperationDetails({tokenInfo, total, type}: TokenDetails) {

    const icon = tokenInfo?.icon || "";
    const name = tokenInfo?.name || ""
    const symbol = tokenInfo?.symbol;
    const balance = tokenInfo?.balance;

    return <>
        <div className={Styles.operationDetails}>
            <div className={Styles.tokenDetails}>
                <div className={Styles.tokenDetails}>
                    <Image src={icon} alt={name} width={50} height={50}/>
                    <p>{name}<span>({symbol})</span></p>
                </div>
                {Boolean(balance) && <span>{(balance || 0) / 10 ** 18}</span>}
            </div>
            <span>Total: {total} {symbol}</span>
        </div>
    </>
}