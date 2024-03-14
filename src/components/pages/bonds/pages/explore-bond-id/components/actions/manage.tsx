import {ContractExtendedInfoFormat} from "@/modules/cloud-api/contract-type";
import {TxTypes} from "@/modules/web3/constants";
import {useState} from "react";
import BigNumber from "bignumber.js";
import {toast} from "react-toastify";
import {Percentages} from "@/components/pages/bonds/pages/explore-bond-id/components/actions/utils";
import {Loading} from "@/components/utils/loading";
import {isAddress} from "viem";
import {useTransaction} from "@/modules/utils/transaction";
import {ShowContainer, useShow} from "@/components/utils/container";

export default function ManageTab({contractInfo}: Readonly<{ contractInfo: ContractExtendedInfoFormat }>) {

    return <div className='flex flex-col h-full w-full'>
        <div className='grid grid-cols-4 gap-2'>
            <DepositPayout contractInfo={contractInfo}/>
            <Settle contractInfo={contractInfo}/>
            <WithdrawExcessInterest contractInfo={contractInfo}/>
            <UpdateBondSupply contractInfo={contractInfo}/>
            <DecreaseMaturityPeriod contractInfo={contractInfo}/>
            <ChangeOwner contractInfo={contractInfo}/>
        </div>
    </div>
}

function DepositPayout({contractInfo}: Readonly<{ contractInfo: ContractExtendedInfoFormat }>) {
    const {_id, payout, totalBonds, redeemed} = contractInfo;
    const [contractAddress, chainId] = _id.split("_");

    const {isOpen, openOrClose} = useShow();
    const [amount, setAmount] = useState(0);

    const handler = [amount, setAmount];
    const maxPayout = (totalBonds - redeemed) * payout.amountClean;

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
        className="group col-span-4 flex flex-col gap-2 p-2 border border-neutral-900 rounded-md cursor-pointer bg-neutral-800">
        <button className='group-hover:text-white flex items-center gap-1 text-sm text-neutral-400 whitespace-nowrap'
                onClick={openOrClose}>Deposit Payout {isLoading && <Loading percent={80}/>}</button>
        <ShowContainer isOpen={isOpen}>
            <InputContainer handler={handler}
                            placeholder='Enter The Payout Token Amoun'
                            maxValue={maxPayout}
                            symbol={payout.symbol}
                            submit={submit}/>
        </ShowContainer>
    </div>
}

function Settle({contractInfo}: Readonly<{ contractInfo: ContractExtendedInfoFormat }>) {
    const [contractAddress, chainId] = contractInfo._id.split("_");
    const {submitTransaction, isLoading} = useTransaction(chainId, TxTypes.Settle, {contractAddress})

    function submit() {
        if (contractInfo.isSettled) return toast.error("Bond is already settled")
        return submitTransaction();
    }

    return <button
        className="flex items-center gap-1 text-sm text-neutral-400 whitespace-nowrap bg-neutral-800 rounded-md p-2 cursor-pointer hover:text-white"
        onClick={submit}>Settle
        {isLoading && <Loading percent={80}/>}</button>
}

function WithdrawExcessInterest({contractInfo}: Readonly<{ contractInfo: ContractExtendedInfoFormat }>) {
    const [contractAddress, chainId] = contractInfo._id.split("_");
    const {submitTransaction, isLoading} = useTransaction(chainId, TxTypes.WithdrawExcessPayout, {contractAddress})


    return <button
        className={`col-span-3 flex items-center gap-1 text-sm text-neutral-400 whitespace-nowrap bg-neutral-800 rounded-md p-2 cursor-pointer hover:text-white`}
        onClick={submitTransaction}>Withdraw Excess Payout
        {isLoading && <Loading percent={80}/>}</button>
}

function UpdateBondSupply({contractInfo}: Readonly<{ contractInfo: ContractExtendedInfoFormat }>) {
    const {_id} = contractInfo;

    const [contractAddress, chainId] = _id.split("_");

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
        className="group col-span-4 flex flex-col gap-2 p-2 border border-neutral-900 rounded-md cursor-pointer bg-neutral-800">
        <button className='group-hover:text-white flex items-center gap-1 text-sm text-neutral-400 whitespace-nowrap'
                onClick={openOrClose}>Update Bond Supply {isLoading && <Loading percent={80}/>}</button>
        <ShowContainer isOpen={isOpen}>
            <InputContainer handler={handler} submit={submit} placeholder='Enter The Desired Bond Supply'/>
        </ShowContainer>
    </div>
}

function DecreaseMaturityPeriod({contractInfo}: Readonly<{ contractInfo: ContractExtendedInfoFormat }>) {
    // todo continue
    const {_id,} = contractInfo;

    const [contractAddress, chainId] = _id.split("_");

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
        className={`group col-span-4 flex flex-col gap-2 p-2 border border-neutral-900 rounded-md cursor-pointer bg-neutral-800`}>
        <button className='group-hover:text-white flex items-center gap-1 text-sm text-neutral-400 whitespace-nowrap'
                onClick={openOrClose}>Decrease Maturity Period {isLoading && <Loading percent={80}/>}</button>
        <ShowContainer isOpen={isOpen}>
            <InputContainer handler={handler} submit={submit} placeholder='Maturit Period In Blocks'/>
        </ShowContainer>
    </div>
}

function ChangeOwner({contractInfo}: Readonly<{ contractInfo: ContractExtendedInfoFormat }>) {
    const {_id,} = contractInfo;

    const [contractAddress, chainId] = _id.split("_");

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
        className={`group col-span-4 flex flex-col gap-2 p-2 border border-neutral-900 rounded-md cursor-pointer bg-neutral-800`}>
        <button className='group-hover:text-white flex items-center gap-1 text-sm text-neutral-400 whitespace-nowrap'
                onClick={openOrClose}>Change Owner {isLoading && <Loading percent={80}/>}</button>
        <ShowContainer isOpen={isOpen}>
            <InputContainer handler={handler}
                            submit={submit}
                            type="string"
                            placeholder='The Desired Maturit Period In Blocks'/>
        </ShowContainer>
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

        const value = maxValue * percent / 100
        setValue(Math.floor(value));
    }

    return <div className='flex flex-col gap-1 '>
        <div
            className='flex justify-between items-center gap-2 bg-neutral-950 border border-neutral-700 rounded-md w-full'>
            <input type="text"
                   className='w-full bg-transparent placeholder:text-sm px-2'
                   value={value || ""}
                   onChange={change}
                   placeholder={placeholder}/>
            {symbol && <span className='text-sm text-neutral-400 font-medium'>{symbol}</span>}
            <button className='bg-white text-black px-2 py-1 rounded-r-md hover:bg-green-300'
                    onClick={submit}>Submit
            </button>
        </div>
        {Boolean(maxValue) && <Percentages setter={setPercentage}/>}
    </div>
}
