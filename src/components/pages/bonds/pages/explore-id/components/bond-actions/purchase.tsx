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

    // console.log(`interestToken`, interestToken)
    // console.log(`address`, address)
    // console.log(`contract`, _id)

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
            if (!Number(amount) || !isFinite(amount)) {
                return;
            }

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
        let className = `bg-transparent text-white  px-5 p-3 rounded border border-solid border-w1 hover:bg-white hover:text-black`;
        let onClick = submit

        if (!Number(bondsLeft)) {
            title = `Sold Out`
            className += ` ${Styles.disable}`
            onClick = async () => {
            };
        } else if (Number(amount) > Number(bondsLeft)) {
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
        <div className="flex flex-col gap-4">
            <input
                className="bg-transparent placeholder:text-g text-white text-sm px-5 p-3 rounded border border-solid border-w1"
                type="number"
                disabled={!bondsLeft}
                onChange={onChange}
                placeholder="The amount of bonds you want to purchase"/>
            <div className='flex flex-col gap-2'>
                <span className='text-xs text-g2'>You confirm that you have read and understood the Terms and Conditions.</span>
                <SubmitButton/>
            </div>
        </div>
    </>
}