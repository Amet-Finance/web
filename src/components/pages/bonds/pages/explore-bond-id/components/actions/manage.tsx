import {ContractCoreDetails} from "@/modules/api/contract-type";
import {TxTypes} from "@/modules/web3/constants";
import {useRef, useState} from "react";
import BigNumber from "bignumber.js";
import {toast} from "react-toastify";
import {Percentages} from "@/components/pages/bonds/pages/explore-bond-id/components/actions/utils";
import {Loading} from "@/components/utils/loading";
import {isAddress} from "viem";
import {useTransaction} from "@/modules/utils/transaction";
import {ConditionalRenderer, useShow} from "@/components/utils/container";
import {DefaultButton} from "@/components/utils/buttons";
import XmarkSVG from "../../../../../../../../public/svg/utils/xmark";

// todo make this section cleaner and add visualisation(icons)

export default function ManageTab({contractInfo}: Readonly<{ contractInfo: ContractCoreDetails }>) {

    return <div className='flex flex-col w-full max-h-full overflow-y-auto'>
        <div className='flex flex-col gap-2'>
            <DepositPayout contractInfo={contractInfo}/>
            <Settle contractInfo={contractInfo}/>
            <WithdrawExcessPayout contractInfo={contractInfo}/>
            <UpdateBondSupply contractInfo={contractInfo}/>
            <DecreaseMaturityPeriod contractInfo={contractInfo}/>
            <ChangeOwner contractInfo={contractInfo}/>
        </div>
    </div>
}

function DepositPayout({contractInfo}: Readonly<{ contractInfo: ContractCoreDetails }>) {
    const {contractAddress, chainId, payout, totalBonds, redeemed, payoutBalance} = contractInfo;

    const {isOpen, openOrClose} = useShow();
    const [amount, setAmount] = useState(0);

    const handler = [amount, setAmount];
    const payoutBalanceClean = BigNumber(payoutBalance).div(BigNumber(10).pow(BigNumber(payout.decimals))).toNumber()
    const maxPayout = ((totalBonds - redeemed) * payout.amountClean);
    const maxPayoutDeposit = Math.max(maxPayout - payoutBalanceClean, 0)

    const {submitTransaction, isLoading} = useTransaction(chainId, TxTypes.TransferERC20, {
        contractAddress: payout.contractAddress,
        toAddress: contractAddress,
        amount: `0x${BigNumber(amount).times(BigNumber(10).pow(BigNumber(payout.decimals))).toString(16)}`
    })


    async function submit() {
        try {
            if (amount <= 0) return toast.error("Invalid amount");
            await submitTransaction();
        } catch (error: any) {

        }
    }

    return <div
        className="group flex flex-col gap-2 p-2 border border-neutral-900 rounded-md cursor-pointer bg-neutral-800">
        <button className='flex justify-between' onClick={openOrClose}>
            <p className='group-hover:text-white flex items-center gap-1 text-sm text-neutral-400 whitespace-nowrap'>Deposit
                Payout {isLoading &&
                    <Loading percent={80}/>}</p>
            <ConditionalRenderer isOpen={isOpen}>
                <XmarkSVG onClick={openOrClose} isSmall/>
            </ConditionalRenderer>
        </button>
        <ConditionalRenderer isOpen={isOpen}>
            <InputContainer handler={handler}
                            placeholder='Payout Amount'
                            maxValue={maxPayoutDeposit}
                            symbol={payout.symbol}
                            submit={submit}/>
        </ConditionalRenderer>
    </div>
}

function Settle({contractInfo}: Readonly<{ contractInfo: ContractCoreDetails }>) {
    const {contractAddress, chainId} = contractInfo;
    const {submitTransaction, isLoading} = useTransaction(chainId, TxTypes.Settle, {contractAddress})

    function submit() {
        if (contractInfo.isSettled) return toast.error("Bond is already settled")
        return submitTransaction();
    }

    return <button
        className="flex items-center gap-1 text-sm text-neutral-400 whitespace-nowrap bg-neutral-800 rounded-md p-2 cursor-pointer hover:text-white"
        onClick={submit}>Settle Bonds
        {isLoading && <Loading percent={80}/>}</button>
}

function WithdrawExcessPayout({contractInfo}: Readonly<{ contractInfo: ContractCoreDetails }>) {

    const {contractAddress, chainId, payoutBalance, totalBonds, redeemed, payout} = contractInfo;
    const {submitTransaction, isLoading} = useTransaction(chainId, TxTypes.WithdrawExcessPayout, {contractAddress})

    const excessPayout = BigNumber(payoutBalance).minus(BigNumber(totalBonds - redeemed).times(BigNumber(payout.amount)))
    const excessPayoutClean = excessPayout.div(BigNumber(10).pow(BigNumber(payout.decimals))).toNumber()

    return <button
        className={`flex items-center gap-1 text-sm text-neutral-400 whitespace-nowrap bg-neutral-800 rounded-md p-2 cursor-pointer hover:text-white`}
        onClick={submitTransaction}>Withdraw Excess Payout <ConditionalRenderer
        isOpen={Boolean(excessPayoutClean) && excessPayoutClean > 0}>-<span
        className='text-green-500'>{excessPayoutClean} {payout.symbol}</span></ConditionalRenderer>
        {isLoading && <Loading percent={80}/>}</button>
}

function UpdateBondSupply({contractInfo}: Readonly<{ contractInfo: ContractCoreDetails }>) {
    const {contractAddress, chainId} = contractInfo;

    const {isOpen, openOrClose} = useShow();
    const [amount, setAmount] = useState(0);

    const handler = [amount, setAmount];

    const {submitTransaction, isLoading} = useTransaction(chainId, TxTypes.UpdateBondSupply, {
        contractAddress: contractAddress,
        count: BigInt(amount)
    })

    async function submit() {
        if (amount <= 0) return toast.error("Invalid amount");
        await submitTransaction();
    }

    return <div
        className="group flex flex-col gap-2 p-2 border border-neutral-900 rounded-md cursor-pointer bg-neutral-800">
        <button className='flex justify-between' onClick={openOrClose}>
            <p className='group-hover:text-white flex items-center gap-1 text-sm text-neutral-400 whitespace-nowrap'>Update
                Bond Supply {isLoading &&
                    <Loading percent={80}/>}</p>
            <ConditionalRenderer isOpen={isOpen}>
                <XmarkSVG onClick={openOrClose} isSmall/>
            </ConditionalRenderer>
        </button>
        <ConditionalRenderer isOpen={isOpen}>
            <InputContainer handler={handler} submit={submit} placeholder='New Bond Supply'/>
        </ConditionalRenderer>
    </div>
}

function DecreaseMaturityPeriod({contractInfo}: Readonly<{ contractInfo: ContractCoreDetails }>) {
    const {contractAddress, chainId,} = contractInfo;

    const {isOpen, openOrClose} = useShow();
    const [amount, setAmount] = useState(0);

    const handler = [amount, setAmount];

    const {submitTransaction, isLoading} = useTransaction(chainId, TxTypes.DecreaseMaturityPeriod, {
        contractAddress: contractAddress,
        period: BigInt(amount)
    })


    async function submit() {
        if (amount <= 0) return toast.error("Invalid amount");
        await submitTransaction();
    }

    return <div
        className={`group flex flex-col gap-2 p-2 border border-neutral-900 rounded-md cursor-pointer bg-neutral-800`}>
        <button className='group-hover:text-white flex items-center gap-1 text-sm text-neutral-400 whitespace-nowrap'
                onClick={openOrClose}>Decrease Maturity Period {isLoading && <Loading percent={80}/>}</button>
        <ConditionalRenderer isOpen={isOpen}>
            <InputContainer handler={handler} submit={submit} placeholder='Maturit Period In Blocks'/>
        </ConditionalRenderer>
    </div>
}

function ChangeOwner({contractInfo}: Readonly<{ contractInfo: ContractCoreDetails }>) {

    // todo also show pending owner if there's any
    const {contractAddress, chainId} = contractInfo;

    const {isOpen, openOrClose} = useShow()
    const [owner, setOwner] = useState();

    const handler = [owner, setOwner];


    const {submitTransaction, isLoading} = useTransaction(chainId, TxTypes.ChangeOwner, {
        contractAddress: contractAddress,
        owner
    })

    async function submit() {
        if (!owner || !isAddress(owner)) return toast.error("Invalid owner");
        await submitTransaction()
    }

    return <div
        className={`group flex flex-col gap-2 p-2 border border-neutral-900 rounded-md cursor-pointer bg-neutral-800`}>
        <button className='group-hover:text-white flex items-center gap-1 text-sm text-neutral-400 whitespace-nowrap'
                onClick={openOrClose}>Change Owner {isLoading && <Loading percent={80}/>}</button>
        <ConditionalRenderer isOpen={isOpen}>
            <InputContainer handler={handler}
                            submit={submit}
                            type="string"
                            placeholder='New Owner Address'/>
        </ConditionalRenderer>
    </div>
}

function InputContainer({handler, maxValue, symbol, submit, placeholder, type}: Readonly<{
    handler: Array<any>,
    type?: string,
    maxValue?: number,
    symbol?: string,
    placeholder?: string
    submit: any
}>) {

    const ref = useRef<any>();
    const [value, setValue] = handler;

    function change(event: any) {
        if (type === "string") {
            setValue(event.target.value)
        } else {
            setValue(Number(event.target.value))
        }

    }

    function setPercentage(percent: number) {
        if (!maxValue) return;

        const value = Math.floor(maxValue * percent / 100)
        setValue(value);
        ref.current.value = value;
    }

    return <div className='flex flex-col gap-2'>
        <div className='flex flex-col justify-between items-center gap-2 bg-neutral-950 rounded-md w-full'>
            <div className='flex justify-between w-full items-center gap-2 px-2'>
                <input type="text"
                       ref={ref}
                       className='w-full bg-transparent placeholder:text-sm'
                       onChange={change}
                       placeholder={placeholder}/>
                <ConditionalRenderer isOpen={Boolean(symbol)}>
                    <span className='text-sm text-neutral-400 font-medium'>{symbol}</span>
                </ConditionalRenderer>
            </div>
            <DefaultButton classType='1' onClick={submit}>Submit</DefaultButton>
        </div>
        <ConditionalRenderer isOpen={Boolean(maxValue)}>
            <Percentages setter={setPercentage}/>
        </ConditionalRenderer>
    </div>
}
