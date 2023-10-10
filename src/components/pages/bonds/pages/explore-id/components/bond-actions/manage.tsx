import {BondInfoDetailed, TokenInfo} from "@/modules/web3/type";
import Styles from "@/components/pages/bonds/pages/explore-id/components/bond-actions/index.module.css";
import {useRef} from "react";
import {submitTransaction} from "@/modules/web3";
import {TxTypes, WalletTypes} from "@/modules/web3/constants";
import {toast} from "react-toastify";
import {toBN} from "@/modules/web3/util";

export default function Manage({info, tokens}: { info: BondInfoDetailed, tokens: { [key: string]: TokenInfo } }) {

    const depositRef = useRef<any>(null)
    const changeOwner = useRef(null)
    const issueBonds = useRef(null)
    const burnBonds = useRef(null)

    async function deposit() {
        const value = depositRef?.current?.value;
        if (!value) {
            return toast.error('Please fill the amount field');
        }

        console.log(info, tokens)
        const interestToken = tokens[info.interestToken]
        if (!interestToken) {
            return toast.error('Interest token was not found');
        }

        const depositValue = toBN(value).mul(toBN(10).pow(toBN(interestToken.decimals)))

        const transaction = await submitTransaction(WalletTypes.Metamask, TxTypes.TransferERC20, {
            contractAddress: interestToken.contractAddress,
            toAddress: info._id,
            amount: depositValue
        });
        console.log(transaction)
    }

    async function withdrawRemaining() {
        const transaction = await submitTransaction(WalletTypes.Metamask, TxTypes.WithdrawRemaining, {
            contractAddress: info._id,
        });
        console.log(transaction);
    }

    return <>
        <div className="flex flex-col gap-4 text-sm">
            <div className='flex gap-2 justify-between items-center border border-solid border-w1 rounded'>
                <input type="number" ref={depositRef} className='px-2 w-full bg-transparent text-g'
                       placeholder="The amount to secure"/>
                <button className="px-2 py-1 border border-l-2 border-w1" onClick={deposit}>Deposit</button>
            </div>
            <button className="px-2 py-2 border border-solid border-w1 rounded" onClick={withdrawRemaining}>Withdraw
                Remaining
            </button>
            <div className='flex gap-2 justify-between items-center border border-solid border-w1 rounded'>
                <input type="number" ref={changeOwner} className='px-2 w-full bg-transparent'/>
                <button className="px-2 py-1 border border-l-2 border-w1">Change Owner</button>
            </div>
            <div className='flex gap-2 justify-between items-center border border-solid border-w1 rounded'>
                <input type="number" ref={issueBonds} className='px-2 w-full bg-transparent'/>
                <button className="px-2 py-1 border border-l-2 border-w1">Issue bonds</button>
            </div>
            <div className='flex gap-2 justify-between items-center border border-solid border-w1 rounded'>
                <input type="number" ref={burnBonds} className='px-2 w-full bg-transparent'/>
                <button className="px-2 py-1 border border-l-2 border-w1">Burn bonds</button>
            </div>
        </div>
    </>
}