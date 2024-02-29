import {ContractExtendedInfoFormat} from "@/modules/cloud-api/contract-type";
import {useAccount, useNetwork, useSendTransaction, useSwitchNetwork} from "wagmi";
import {getChain} from "@/modules/utils/wallet-connect";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import BigNumber from "bignumber.js";
import {TxTypes} from "@/modules/web3/constants";
import {getContractInfoByType, trackTransaction} from "@/modules/web3";
import {getAllowance} from "@/modules/web3/tokens";
import {toast} from "react-toastify";
import Link from "next/link";
import {URLS} from "@/modules/utils/urls";
import {BasicButton} from "@/components/utils/buttons";
import Loading from "@/components/utils/loading";
import {Agreement, Percentages} from "@/components/pages/bonds/pages/explore-bond-id/components/actions/utils";

export default function PurchaseTab({contractInfo}: { contractInfo: ContractExtendedInfoFormat }) {
    const {_id, purchase, totalBonds, purchased} = contractInfo;
    const [contractAddress, chainId] = _id.toLowerCase().split("_");
    const {address} = useAccount();
    const network = useNetwork();
    const {switchNetworkAsync} = useSwitchNetwork({chainId: Number(chainId)});
    const chain = getChain(chainId)
    const router = useRouter();

    const TitleTypes = {
        Purchase: "Purchase",
        Approve: "Approve",
        NotEnough: "Not Enough Bonds to Purchas",
        SoldOut: "Sold Out"
    }

    const [isLoadingEffect, setLoadingEffect] = useState(false)
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

    const initialReferrer = `${router.query.ref}`
    const referrer = initialReferrer.toLowerCase() !== address?.toLowerCase() ? initialReferrer : undefined;
    const transactionType = isApprove ? TxTypes.ApproveToken : TxTypes.PurchaseBonds;
    const config = isApprove ?
        {contractAddress: purchase.contractAddress, spender: contractAddress, value: `0x${required.toString(16)}`} :
        {contractAddress: contractAddress, count: amount, referrer: referrer}

    const txConfig = getContractInfoByType(chain, transactionType, config)
    const {sendTransactionAsync, isLoading} = useSendTransaction(txConfig)

    useEffect(() => {
        if (chain && address) {
            setLoadingEffect(true)
            getAllowance(chain, purchase.contractAddress, address, contractAddress)
                .then(response => setAllowance(response.toString()))
                .finally(() => setLoadingEffect(false))
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
        try {
            if (blockClick) return;
            if (!chain) return toast.error("Please select correct chain")
            if (network.chain?.id !== chain.id) await switchNetworkAsync?.(chain.id);

            const response = await sendTransactionAsync();
            const result = await trackTransaction(chain, response.hash);
            setRefresh(Math.random());
            console.log(result)
        } catch (error) {
            console.log(error)
        }
    }


    return <>
        <div className='flex flex-col gap-4 justify-between w-full'>
            <span/>
            <div className='flex flex-col gap-4'>
                <div className='flex flex-col gap-2'>
                    <div
                        className='flex flex-col items-center justify-between border border-neutral-800 rounded-md py-1.5 px-4'>
                        <input type="number"
                               id='amount'
                               className='bg-transparent placeholder:text-neutral-600 w-full'
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
    </>
}
