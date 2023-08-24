import {useEffect, useState} from "react";
import Styles from "./index.module.css";
import {getAllowance} from "@/modules/web3/tokens";
import {BondInfo} from "@/components/pages/bonds/pages/issue/type";
import {useSelector} from "react-redux";
import {Account} from "@/store/redux/account/type";
import {getWeb3Instance, submitTransaction} from "@/modules/web3";
import {TxTypes, WalletTypes} from "@/modules/web3/constants";
import {toBN} from "web3-utils";

const Actions: { [key: string]: string } = {
    Purchase: 'purchase',
    Redeem: 'redeem'
}

export default function BondActions({info}: any) {
    const [action, setAction] = useState(Actions.Purchase);
    const actionHandler = [action, setAction];

    return <>
        <div className={Styles.bondActions}>
            <div className={Styles.sectionHorizontal}>
                {Object.keys(Actions).map((key: string) => <ActionButton name={key}
                                                                         actionHandler={actionHandler}
                                                                         key={key}/>)}
            </div>
            <Action actionHandler={actionHandler} info={info}/>
        </div>
    </>
}

function ActionButton({name, actionHandler}: any) {
    const [action, setAction] = actionHandler;
    const isSelected = Actions[name] === action;
    const className = `${Styles.action} ${isSelected ? Styles.selectedAction : ""}`
    const select = () => setAction(Actions[name])

    return <>
        <span className={className} onClick={select}>{name}</span>
    </>
}

function Action({actionHandler, info}: any) {
    const [action, setAction] = actionHandler;

    switch (action) {
        case Actions.Purchase: {
            return <Purchase info={info}/>
        }
        default: {
            return <></>
        }
    }
}

function Purchase({info}: { info: BondInfo }) {

    const {
        _id,
        investmentTokenInfo,
        investmentTokenAmount,
        interestToken
    } = info;

    const [effectRefresher, setEffectRefresher] = useState(0);
    const [amount, setAmount] = useState(0);
    const [allowance, setAllowance] = useState(0)
    const account: Account = useSelector((item: any) => item.account);
    const {address} = account;

    useEffect(() => {
        getAllowance(interestToken, address, _id)
            .then(response => setAllowance(response))
            .catch(error => null)
    }, [address, effectRefresher])


    if (!investmentTokenInfo) {
        return null;
    }

    const decimals = Number(investmentTokenInfo?.decimals) || 18

    console.log(info)
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

    async function sumbit() {
        if (isApproval) {

            const web3 = getWeb3Instance();
            const {toBN} = web3.utils;
            if (!info.investmentTokenInfo?.decimals || !info.investmentTokenAmount) {
                return;
            }

            const transaction = await submitTransaction(WalletTypes.Metamask, TxTypes.ApproveToken, {
                contractAddress: info.investmentToken,
                spender: info._id,
                value: toBN(amount).mul(toBN(info.investmentTokenAmount))
            });
            console.log(transaction)
        } else {
            const transaction = await submitTransaction(WalletTypes.Metamask, TxTypes.PurchaseBonds, {
                contractAddress: info._id,
                count: amount
            });
            console.log(transaction);
        }
        setEffectRefresher(Math.random());

    }

    const title = isApproval ? `Approve ${info.investmentTokenInfo?.symbol}` : "Purchase"

    return <>
        <div className={Styles.section}>
            <input className={Styles.input} type="number"
                   onChange={onChange}
                   placeholder="The amount of bonds you want to purchase"/>
            <button className={Styles.submit} onClick={sumbit}>{title}</button>
        </div>
    </>
}