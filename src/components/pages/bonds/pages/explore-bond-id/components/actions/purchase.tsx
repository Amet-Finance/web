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
import {useAccountExtended, useBalances, useConnectWallet} from "@/modules/utils/address";
import AccountStore from "@/store/redux/account";
import {nop} from "@/modules/utils/function";
import CalculatorController from "@/components/pages/bonds/utils/calculator";

export default function PurchaseTab({contractInfo}: Readonly<{ contractInfo: ContractCoreDetails }>) {
    const {contractAddress, chainId, purchase, totalBonds, purchased, payout} = contractInfo;

    const {address, open} = useAccountExtended();
    const {hasBalance} = useBalances({contractAddress})
    const chain = getChain(chainId);
    const router = useRouter();

    const securedPercentage = CalculatorController.securedPercentage(contractInfo)

    const TitleTypes = {
        Purchase: "Purchase",
        PurchaseToken: `Get ${purchase.symbol} to Purchase`,
        Approve: "Approve",
        NotEnough: "Not Enough Bonds to Purchase",
        SoldOut: "Sold Out",
        Connect: "Connect"
    }

    const [balance, setBalance] = useState<number>(0);
    const [allowance, setAllowance] = useState("0")
    const [amount, setAmount] = useState(0);
    const [refresh, setRefresh] = useState(0);
    const [lowPayoutModalOpened, setLowPayoutModalOpened] = useState(false);

    const currentAllowance = BigNumber(allowance.toString())
    const required = BigNumber(amount).times(BigNumber(purchase.amount))
    const needed = currentAllowance.minus(required);

    const totalPrice = purchase.amountClean * amount;

    const isApprove = needed.isLessThan(BigNumber(0))
    const isSoldOut = totalBonds === purchased;

    const isSwapToken = totalPrice > balance;
    const openLowPayoutModal = securedPercentage < 10 && !lowPayoutModalOpened

    const purchasingMoreThenAllowed = purchased + amount > totalBonds
    const blockClick = purchasingMoreThenAllowed || amount <= 0

    let title = TitleTypes.Purchase

    if (isApprove) title = TitleTypes.Approve
    if (isSwapToken) title = TitleTypes.PurchaseToken
    if (purchasingMoreThenAllowed) title = TitleTypes.NotEnough
    if (isSoldOut) title = TitleTypes.SoldOut
    if (!address) title = TitleTypes.Connect


    const swapUrl = `https://swap.defillama.com/?chain=base&from=0x0000000000000000000000000000000000000000&to=${purchase.contractAddress}&utm_source=amet.finance`

    const initialReferrer = router.query.ref ? `${router.query.ref}` : undefined
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

    useEffect(() => {
        const updater = () => {
            if (chain && address) {
                Erc20Controller.getTokenBalanceNormalized(chainId, purchase.contractAddress, address, purchase.decimals)
                    .then(response => setBalance(response.normalizedBalance))
            }
        }

        updater();
        const interval = setInterval(() => updater, 5000);
        return () => clearInterval(interval)
    }, [chain, address, chainId, purchase.contractAddress, purchase.decimals]);

    function onChange(event: any) {
        const {value} = event.target;
        const number = Number(Math.round(value));
        if (Number.isFinite(number)) setAmount(number);
    }

    function setPercentage(percent: number) {
        const left = totalBonds - purchased;
        if (left) {
            setAmount(Math.floor(left * percent / 100))
        }
    }

    async function submit() {
        if (!address) {
            return open();
        }

        if (blockClick) return;
        if (!chain) return toast.error("Please select correct chain");

        if (isSwapToken) {
            return window.open(swapUrl, '_ blank');
        }

        if (openLowPayoutModal) {
            ModalStore.openModal(ModalTypes.LowPayout)
            return setLowPayoutModalOpened(true);
        }

        const transaction = await submitTransaction();
        if (transaction) {
            if (!hasBalance) {
                ModalStore.openModal(ModalTypes.FirstTimePurchaseBond)
                setRefresh(Math.random());
            }
            AccountStore.initBalances(address).catch(nop);
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
                                className='md:text-4xl text-2xl font-bold'>-{formatLargeNumber(totalPrice, false, 2)} {purchase.symbol}</span>
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


                        <DefaultButton onClick={submit} disabled={blockClick && Boolean(address)} classType="1">
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
