import {ContractCoreDetails} from "@/modules/api/contract-type";
import {useAccount} from "wagmi";
import {getChain} from "@/modules/utils/wallet-connect";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import BigNumber from "bignumber.js";
import {TxTypes} from "@/modules/web3/constants";
import {toast} from "react-toastify";
import {Loading} from "@/components/utils/loading";
import {Agreement, Percentages} from "@/components/pages/bonds/pages/explore-bond-id/components/actions/utils";
import {formatLargeNumber} from "@/modules/utils/numbers";
import {useTransaction} from "@/modules/utils/transaction";
import XmarkSVG from "../../../../../../../../public/svg/utils/xmark";
import {ConditionalRenderer, ToggleBetweenChildren} from "@/components/utils/container";
import {DefaultButton} from "@/components/utils/buttons";
import {Erc20Controller} from "amet-utils";
import ModalStore from "@/store/redux/modal";
import {ModalTypes} from "@/store/redux/modal/constants";
import {useBalances} from "@/modules/utils/address";

export default function PurchaseTab({contractInfo}: Readonly<{ contractInfo: ContractCoreDetails }>) {
    const {contractAddress,chainId, purchase, totalBonds, purchased, payout} = contractInfo;

    const {address} = useAccount();
    const {hasBalance} = useBalances({contractAddress})
    const chain = getChain(chainId);
    const router = useRouter();

    const TitleTypes = {
        Purchase: "Purchase",
        Approve: "Approve",
        NotEnough: "Not Enough Bonds to Purchase",
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

    const initialReferrer = Boolean(router.query.ref) ? `${router.query.ref}` : undefined
    const referrer = initialReferrer?.toLowerCase() !== address?.toLowerCase() ? initialReferrer : undefined;
    const transactionType = isApprove ? TxTypes.ApproveToken : TxTypes.PurchaseBonds;
    const config = isApprove ?
        {contractAddress: purchase.contractAddress, spender: contractAddress, value: `0x${required.toString(16)}`} :
        {contractAddress: contractAddress, count: amount, referrer: referrer}


    const {submitTransaction, isLoading} = useTransaction(chainId, transactionType, config)

    useEffect(() => {
        if (chain && address) {
            Erc20Controller.getAllowance(chain.id, purchase.contractAddress, address, contractAddress)
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
        const transaction = await submitTransaction();
        if (transaction && !hasBalance) {
            ModalStore.openModal(ModalTypes.FirstTimePurchaseBond)
            setRefresh(Math.random());
        }

    }

    return (
        <div className='flex flex-col gap-1 justify-end w-full'>
            <ToggleBetweenChildren isOpen={isSoldOut}>
                <div className='flex justify-center items-center w-full h-full'>
                    <span className='text-3xl font-bold text-neutral-400'>SOLD OUT</span>
                </div>
                <>
                <ConditionalRenderer isOpen={Boolean(totalPrice)}>
                        <div
                            className='flex flex-col justify-center items-center rounded-md px-4 py-1 bg-neutral-700 h-full whitespace-nowrap'>
                            <span
                                className='text-4xl font-bold'>-{formatLargeNumber(totalPrice, false, 2)} {purchase.symbol}</span>
                            <span className='text-xs'>Total Purchase Amount:</span>
                        </div>
                </ConditionalRenderer>
                    <div className='flex flex-col gap-2'>
                        <div
                            className='flex flex-col items-center justify-between  rounded-md py-1 w-full border border-neutral-900 px-2'>
                            <div className='flex items-center justify-between w-full'>
                                <input type="number"
                                       id='amount'
                                       className='bg-transparent placeholder:text-neutral-600 w-full text-sm'
                                       value={amount || ""}
                                       onChange={onChange}
                                       placeholder='Enter Number of Bonds to Purchase'/>
                                <ConditionalRenderer isOpen={Boolean(amount)}>
                                    <XmarkSVG isSmall onClick={setAmount.bind(null, 0)}/>
                                </ConditionalRenderer>
                            </div>
                        </div>
                        <Percentages setter={setPercentage}/>
                        <Agreement actionType={"purchasing"}/>


                        <DefaultButton onClick={submit} disabled={blockClick} classType="1">
                            <div className='flex items-center gap-2'>
                                <ConditionalRenderer isOpen={isLoading}>
                                    <Loading percent={75} color="#000"/>
                                </ConditionalRenderer>
                                {title}
                            </div>
                        </DefaultButton>
                    </div>
                </>
            </ToggleBetweenChildren>
        </div>
    )
}
