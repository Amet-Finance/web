import {BondInfo, Tokens} from "@/components/pages/bonds/pages/issue/type";
import {useEffect, useRef, useState} from "react";
import {useSelector} from "react-redux";
import {RootState} from "@/store/redux/type";
import {getAllowance} from "@/modules/web3/tokens";
import Styles from "@/components/pages/bonds/pages/explore-id/components/bond-actions/index.module.css";
import Loading from "@/components/utils/loading";
import {submitTransaction} from "@/modules/web3";
import {TxTypes, WalletTypes} from "@/modules/web3/constants";
import {initBalance} from "@/store/redux/account";
import {sleep} from "@/modules/utils/dates";
import {toBN} from "@/modules/web3/util";

export default function Purchase({info, tokens}: { info: BondInfo, tokens: Tokens }) {

    const {
        _id,
        investmentTokenAmount,
        total,
        purchased,
        investmentToken
    } = info;

    const investmentTokenInfo = investmentToken ? tokens[investmentToken] : undefined;
    const bondsLeft = Number(total) - Number(purchased);

    const [effectRefresher, setEffectRefresher] = useState(0);
    const inputRef = useRef<any>();
    const [amount, setAmount] = useState(0);
    const [allowance, setAllowance] = useState(0)
    const account = useSelector((item: RootState) => item.account);
    const {address} = account;

    useEffect(() => {
        getAllowance(investmentToken, address, _id)
            .then(response => setAllowance(response))
            .catch(() => null)
    }, [_id, investmentToken, address, effectRefresher])


    if (!investmentTokenInfo) {
        return <>
            <div className='flex justify-center items-center w-full'>
                <Loading/>
            </div>
        </>;
    }

    const decimals = Number(investmentTokenInfo?.decimals) || 18

    const investmentAmountClean = toBN(`${investmentTokenAmount}`).div(toBN(10).pow(toBN(decimals)));
    const totalPrice = amount * investmentAmountClean.toNumber();

    const allowanceDivided = toBN(allowance).div(toBN(10).pow(toBN(decimals))).toNumber();
    const isApproval = totalPrice > allowanceDivided;

    function onChange(event: Event | any) {
        const {value} = event.target;
        setAmount(Number(value) || 0);
    }

    async function submit() {
        if (isApproval) {

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

            await sleep(4000);
            await initBalance(account.address);
            console.log(transaction);
        }

        setEffectRefresher(Math.random());

    }

    function SubmitButton() {
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

    function setPercent(percent: number) {
        const total = Math.floor((bondsLeft * percent) / 100)
        inputRef.current.value = total
        setAmount(total)
    }

    return <>
        <div className="flex flex-col gap-4">
            <div className='flex flex-col gap-2'>
                <input
                    className="bg-transparent placeholder:text-g text-white text-sm px-5 p-3 rounded border border-solid border-w1"
                    type="number"
                    disabled={!bondsLeft}
                    ref={inputRef}
                    onChange={onChange}
                    placeholder="The amount of bonds you want to purchase"/>
                <div className='flex gap-2 items-center'>
                    <button className='px-1.5 py-0.5 border border-solid border-w1 rounded text-sm'
                            onClick={() => setPercent(5)}>5%
                    </button>
                    <button className='px-1.5 py-0.5 border border-solid border-w1 rounded text-sm'
                            onClick={() => setPercent(10)}>10%
                    </button>
                    <button className='px-1.5 py-0.5 border border-solid border-w1 rounded text-sm'
                            onClick={() => setPercent(25)}>25%
                    </button>
                    <button className='px-1.5 py-0.5 border border-solid border-w1 rounded text-sm'
                            onClick={() => setPercent(50)}>50%
                    </button>
                    <button className='px-1.5 py-0.5 border border-solid border-w1 rounded text-sm'
                            onClick={() => setPercent(100)}>100%
                    </button>
                </div>
            </div>
            <div className='flex flex-col gap-2'>
                <span className='text-xs text-g2'>You confirm that you have read and understood the Terms and Conditions.</span>
                <SubmitButton/>
            </div>
        </div>
    </>
}