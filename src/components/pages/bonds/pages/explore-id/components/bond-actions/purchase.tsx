import {BondInfo} from "@/components/pages/bonds/pages/issue/type";
import {TokenInfo} from "@/modules/web3/type";
import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {RootState} from "@/store/redux/type";
import {getAllowance} from "@/modules/web3/tokens";
import Styles from "@/components/pages/bonds/pages/explore-id/components/bond-actions/index.module.css";
import Loading from "@/components/utils/loading";
import {toBN} from "web3-utils";
import {getWeb3Instance, submitTransaction} from "@/modules/web3";
import {TxTypes, WalletTypes} from "@/modules/web3/constants";
import {initBalance} from "@/store/redux/account";

export default function Purchase({info, tokens}: { info: BondInfo, tokens: { [key: string]: TokenInfo } }) {

    const {
        _id,
        investmentTokenAmount,
        total,
        purchased,
        investmentToken,
        interestToken
    } = info;

    const investmentTokenInfo = investmentToken ? tokens[investmentToken] : undefined;
    const bondsLeft = Number(total) - Number(purchased);

    const [effectRefresher, setEffectRefresher] = useState(0);
    const [amount, setAmount] = useState(0);
    const [allowance, setAllowance] = useState(0)
    const account = useSelector((item: RootState) => item.account);
    const {address} = account;

    useEffect(() => {
        getAllowance(interestToken, address, _id)
            .then(response => setAllowance(response))
            .catch(error => null)
    }, [address, effectRefresher])


    if (!investmentTokenInfo) {
        return <>
            <div className={Styles.loader}>
                <Loading/>
            </div>
        </>;
    }

    const decimals = Number(investmentTokenInfo?.decimals) || 18

    // console.log(`investmentTokenAmount, decimals`, investmentTokenAmount, decimals)
    const investmentAmountClean = toBN(`${investmentTokenAmount}`).div(toBN(10).pow(toBN(decimals)));
    const totalPrice = amount * investmentAmountClean.toNumber();

    const allowanceDivided = toBN(allowance).div(toBN(10).pow(toBN(decimals))).toNumber();

    const isApproval = totalPrice > allowanceDivided;

    // const isApproval = false;

    function onChange(event: Event | any) {
        const {value, type} = event.target;
        setAmount(Number(value) || 0);
    }

    async function submit() {
        if (isApproval) {

            const web3 = getWeb3Instance();
            const {toBN} = web3.utils;

            if (!investmentTokenInfo?.decimals || !investmentTokenAmount) {
                return;
            }

            const transaction = await submitTransaction(WalletTypes.Metamask, TxTypes.ApproveToken, {
                contractAddress: investmentToken,
                spender: _id,
                value: toBN(amount).mul(toBN(investmentTokenAmount))
            });
            console.log(transaction)
        } else {
            const transaction = await submitTransaction(WalletTypes.Metamask, TxTypes.PurchaseBonds, {
                contractAddress: _id,
                count: amount
            });
            await initBalance(account.address);
            console.log(transaction);
        }
        setEffectRefresher(Math.random());

    }

    const SubmitButton = () => {
        let title = "Purchase"
        let className = `${Styles.submit}`;
        let onClick = submit

        if (Number(amount) > Number(bondsLeft)) {
            title = `Not enough bonds left`
            className += ` ${Styles.disable}`
            onClick = async () => {
            };
        } else if (isApproval) {
            title = `Approve ${investmentTokenInfo?.symbol}`
        }

        return <button className={className} onClick={onClick}>{title}</button>
    }

    return <>
        <div className={Styles.section}>
            <input className={Styles.input}
                   type="number"
                   onChange={onChange}
                   placeholder="The amount of bonds you want to purchase"/>
            <SubmitButton/>
        </div>
    </>
}