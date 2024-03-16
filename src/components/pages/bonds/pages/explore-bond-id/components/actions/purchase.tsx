import {ContractExtendedInfoFormat} from "@/modules/cloud-api/contract-type";
import {useAccount} from "wagmi";
import {getChain} from "@/modules/utils/wallet-connect";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import BigNumber from "bignumber.js";
import {TxTypes} from "@/modules/web3/constants";
import TokenController from "@/modules/web3/tokens";
import {toast} from "react-toastify";
import {BasicButton} from "@/components/utils/buttons";
import {Loading} from "@/components/utils/loading";
import {Agreement, Percentages} from "@/components/pages/bonds/pages/explore-bond-id/components/actions/utils";
import {formatLargeNumber} from "@/modules/utils/numbers";
import {useTransaction} from "@/modules/utils/transaction";

// todo fetch from blockchain payoutBalance(bond) and if the payout is 0 or low add a warning tab for user so he can be aware of it
// if the payout changes notify the user as well

export default function PurchaseTab({contractInfo}: Readonly<{ contractInfo: ContractExtendedInfoFormat }>) {
    const {_id, purchase, totalBonds, purchased, payout} = contractInfo;

    const [contractAddress, chainId] = _id.toLowerCase().split("_");
    const {address} = useAccount();
    const chain = getChain(chainId)
    const router = useRouter();

    const TitleTypes = {
        Purchase: "Purchase",
        Approve: "Approve",
        NotEnough: "Not Enough Bonds to Purchas",
        SoldOut: "Sold Out"
    }


    const [allowance, setAllowance] = useState("0")
    const [amount, setAmount] = useState(0);
    const [refresh, setRefresh] = useState(0);

    const currentAllowance = BigNumber(allowance.toString())
    const required = BigNumber(amount).times(BigNumber(purchase.amount))
    const needed = currentAllowance.minus(required);

    const isApprove = needed.isLessThan(BigNumber(0))
    const isSoldOut = totalBonds === purchased;


    const purchasingMoreThenAllowed = purchased + amount > totalBonds
    let blockClick = purchasingMoreThenAllowed || amount <= 0

    let title = TitleTypes.Purchase
    if (isApprove) title = TitleTypes.Approve
    if (purchasingMoreThenAllowed) title = TitleTypes.NotEnough
    if (isSoldOut) title = TitleTypes.SoldOut


    const totalPrice = purchase.amountClean * amount;
    const totalRedeemAmount = payout.amountClean * amount;

    const initialReferrer = `${router.query.ref}`
    const referrer = initialReferrer.toLowerCase() !== address?.toLowerCase() ? initialReferrer : undefined;
    const transactionType = isApprove ? TxTypes.ApproveToken : TxTypes.PurchaseBonds;
    const config = isApprove ?
        {contractAddress: purchase.contractAddress, spender: contractAddress, value: `0x${required.toString(16)}`} :
        {contractAddress: contractAddress, count: amount, referrer: referrer}


    const {submitTransaction, isLoading} = useTransaction(chainId, transactionType, config)

    useEffect(() => {
        if (chain && address) {
            TokenController.getAllowance(chain, purchase.contractAddress, address, contractAddress)
                .then(response => setAllowance(response.toString()))
        }
    }, [amount, chain, address, contractAddress, purchase.contractAddress, refresh]);

    function onChange(event: any) {
        const {value} = event.target;
        setAmount(Number(value))
    }

    function setPercentage(percent: number) {
        const left = totalBonds - purchased;
        if (left) {
            setAmount(Math.floor(left * percent / 100))
        }
    }

    async function submit() {
        if (blockClick) return;
        if (!chain) return toast.error("Please select correct chain")
        await submitTransaction();
        setRefresh(Math.random());
    }


    return <div className='flex flex-col gap-1 justify-end w-full'>
        {
            Boolean(totalPrice) && <div
                className='flex flex-col justify-center items-center border border-neutral-900 rounded-md px-4 py-1 bg-neutral-700 h-full'>
                        <span
                            className='text-4xl font-bold whitespace-nowrap'>-{formatLargeNumber(totalRedeemAmount, false, 2)} {payout.symbol}</span>
                <span className='text-xs whitespace-nowrap'>Total Purchase Amount:</span>
            </div>
        }
        <div className='flex flex-col gap-2'>
            <div className='flex flex-col gap-2'>
                <div className='flex flex-col items-center justify-between border border-neutral-800 rounded-md py-1 px-4'>
                    <input type="number"
                           id='amount'
                           className='bg-transparent placeholder:text-neutral-600 w-full placeholder:text-sm text-sm'
                           value={amount || ""}
                           onChange={onChange}
                           placeholder='Enter Number of Bonds to Purchase'/>
                </div>
                <Percentages setter={setPercentage}/>
                <Agreement actionType={"purchasing"}/>
            </div>
            <BasicButton onClick={submit} isBlocked={blockClick}>
                <div className='flex items-center gap-2'>
                    {(isLoading) && <Loading percent={75} color="#000"/>}
                    {title}
                </div>
            </BasicButton>
        </div>
    </div>
}
