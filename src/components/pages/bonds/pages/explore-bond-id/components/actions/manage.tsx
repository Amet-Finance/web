import {ContractExtendedInfoFormat} from "@/modules/cloud-api/contract-type";
import {useSendTransaction} from "wagmi";
import {getContractInfoByType, trackTransaction} from "@/modules/web3";
import {TxTypes} from "@/modules/web3/constants";
import {getChain} from "@/modules/utils/wallet-connect";
import {useState} from "react";
import BigNumber from "bignumber.js";
import {toast} from "react-toastify";
import {Percentages} from "@/components/pages/bonds/pages/explore-bond-id/components/actions/utils";
import Loading from "@/components/utils/loading";
import {isAddress} from "viem";
import {useNetworkValidator} from "@/modules/utils/chain";

export default function ManageTab({contractInfo}: { contractInfo: ContractExtendedInfoFormat }) {

    const baseClass = "flex items-center gap-1 text-sm text-neutral-400 whitespace-nowrap bg-neutral-800 rounded-md p-2 cursor-pointer hover:text-white"
    const withdrawExcessInterest = useWithdrawExcessInterest(contractInfo);

    return <>
        <div className='flex flex-col h-full w-full'>
            <div className='grid grid-cols-4 gap-2'>
                <DepositPayout contractInfo={contractInfo}/>
                <Settle contractInfo={contractInfo}/>
                <span className={`col-span-3 ${baseClass}`} onClick={withdrawExcessInterest.sendTransactionAsync}>Withdraw Excess Payout
                    {withdrawExcessInterest.isLoading && <Loading percent={80}/>}</span>
                <UpdateBondSupply contractInfo={contractInfo}/>
                <DecreaseMaturityPeriod contractInfo={contractInfo}/>
                <ChangeOwner contractInfo={contractInfo}/>
            </div>
        </div>
    </>
}

function DepositPayout({contractInfo}: { contractInfo: ContractExtendedInfoFormat }) {
    const {_id, payout, totalBonds, purchased, redeemed} = contractInfo;
    const [contractAddress, chainId] = _id.split("_");
    const chain = getChain(chainId);

    const validator = useNetworkValidator(chainId)

    const [isOpen, setOpen] = useState(false);
    const [amount, setAmount] = useState(0);

    const handler = [amount, setAmount];
    const maxPayout = (totalBonds - redeemed) * payout.amountClean;

    const config = getContractInfoByType(chain, TxTypes.TransferERC20, {
        contractAddress: payout.contractAddress,
        toAddress: contractAddress,
        amount: `0x${BigNumber(amount).times(BigNumber(10).pow(BigNumber(payout.decimals))).toString(16)}`
    })
    const {sendTransactionAsync, isLoading} = useSendTransaction({
        to: config.to,
        value: config.value,
        data: config.data
    })


    function openOrClose() {
        setOpen(!isOpen)
    }

    async function submit() {
        try {
            if (amount <= 0) return toast.error("Invalid amount");
            await validator.validateAndSwitch();
            const response = await sendTransactionAsync();
            const result = await trackTransaction(chain, response.hash);
            console.log(result)
        } catch (error: any) {

        }
    }

    return <>
        <div
            className={`group col-span-4 flex flex-col gap-2 p-2 border border-neutral-900 rounded-md cursor-pointer bg-neutral-800`}>
            <span className='group-hover:text-white flex items-center gap-1 text-sm text-neutral-400 whitespace-nowrap'
                  onClick={openOrClose}>Deposit Payout {isLoading && <Loading percent={80}/>}</span>
            {
                isOpen && <InputContainer handler={handler}
                                          placeholder='Enter The Payout Token Amoun'
                                          maxValue={maxPayout}
                                          symbol={payout.symbol}
                                          submit={submit}/>
            }
        </div>
    </>
}

function Settle({contractInfo}: { contractInfo: ContractExtendedInfoFormat }) {
    //todo add already settled

    const [contractAddress, chainId] = contractInfo._id.split("_");
    const chain = getChain(chainId);
    const validator = useNetworkValidator(chainId)
    const config = getContractInfoByType(chain, TxTypes.Settle, {contractAddress})
    const {isLoading, sendTransactionAsync} = useSendTransaction({
        to: config.to,
        value: config.value,
        data: config.data
    })

    async function submit() {
        try {
            await validator.validateAndSwitch();
            const response = await sendTransactionAsync?.();
            await trackTransaction(chain, response.hash);
        } catch (error: any) {
            console.log(error)
        }
    }

    return <>
    <span
        className="flex items-center gap-1 text-sm text-neutral-400 whitespace-nowrap bg-neutral-800 rounded-md p-2 cursor-pointer hover:text-white"
        onClick={submit}>Settle
        {isLoading && <Loading percent={80}/>}</span>
    </>
}

function UpdateBondSupply({contractInfo}: { contractInfo: ContractExtendedInfoFormat }) {
    const {_id, payout, totalBonds, purchased, redeemed} = contractInfo;

    const [contractAddress, chainId] = _id.split("_");
    const chain = getChain(chainId);

    const [isOpen, setOpen] = useState(false);
    const [amount, setAmount] = useState(0);

    const handler = [amount, setAmount];

    const config = getContractInfoByType(chain, TxTypes.UpdateBondSupply, {
        contractAddress: contractAddress,
        count: BigInt(amount)
    })
    const {sendTransactionAsync, isLoading} = useSendTransaction({
        to: config.to,
        value: config.value,
        data: config.data
    })


    function openOrClose() {
        setOpen(!isOpen)
    }

    async function submit() {
        try {
            if (amount <= 0) return toast.error("Invalid amount");

            const response = await sendTransactionAsync();
            const result = await trackTransaction(chain, response.hash);
            console.log(result)
        } catch (error: any) {

        }
    }

    return <>
        <div
            className={`group col-span-4 flex flex-col gap-2 p-2 border border-neutral-900 rounded-md cursor-pointer bg-neutral-800`}>
            <span className='group-hover:text-white flex items-center gap-1 text-sm text-neutral-400 whitespace-nowrap'
                  onClick={openOrClose}>Update Bond Supply {isLoading && <Loading percent={80}/>}</span>
            {
                isOpen && <InputContainer handler={handler}
                                          submit={submit}
                                          placeholder='Enter The Desired Bond Supply'/>
            }
        </div>
    </>
}

function DecreaseMaturityPeriod({contractInfo}: { contractInfo: ContractExtendedInfoFormat }) {
    // todo continue
    const {_id, payout, totalBonds, purchased, redeemed} = contractInfo;

    const [contractAddress, chainId] = _id.split("_");
    const chain = getChain(chainId);

    const [isOpen, setOpen] = useState(false);
    const [amount, setAmount] = useState(0);

    const handler = [amount, setAmount];

    const config = getContractInfoByType(chain, TxTypes.DecreaseMaturityPeriod, {
        contractAddress: contractAddress,
        period: BigInt(amount)
    })
    const {sendTransactionAsync, isLoading} = useSendTransaction({
        to: config.to,
        value: config.value,
        data: config.data
    })


    function openOrClose() {
        setOpen(!isOpen)
    }

    async function submit() {
        try {
            if (amount <= 0) return toast.error("Invalid amount");

            const response = await sendTransactionAsync();
            const result = await trackTransaction(chain, response.hash);
            console.log(result)
        } catch (error: any) {

        }
    }

    return <>
        <div
            className={`group col-span-4 flex flex-col gap-2 p-2 border border-neutral-900 rounded-md cursor-pointer bg-neutral-800`}>
            <span className='group-hover:text-white flex items-center gap-1 text-sm text-neutral-400 whitespace-nowrap'
                  onClick={openOrClose}>Decrease Maturity Period {isLoading && <Loading percent={80}/>}</span>
            {
                isOpen && <InputContainer handler={handler} submit={submit}
                                          placeholder='The Desired Maturit Period In Blocks'/>
            }
        </div>
    </>
}

function ChangeOwner({contractInfo}: { contractInfo: ContractExtendedInfoFormat }) {
    const {_id, payout, totalBonds, purchased, redeemed} = contractInfo;

    const [contractAddress, chainId] = _id.split("_");
    const chain = getChain(chainId);

    const [isOpen, setOpen] = useState(false);
    const [owner, setOwner] = useState();

    const handler = [owner, setOwner];

    const config = getContractInfoByType(chain, TxTypes.ChangeOwner, {
        contractAddress: contractAddress,
        owner
    })
    const {sendTransactionAsync, isLoading} = useSendTransaction({
        to: config.to,
        value: config.value,
        data: config.data
    })


    function openOrClose() {
        setOpen(!isOpen)
    }

    async function submit() {
        try {
            if (!owner || !isAddress(owner)) return toast.error("Invalid owner");

            const response = await sendTransactionAsync();
            const result = await trackTransaction(chain, response.hash);
            console.log(result)
        } catch (error: any) {

        }
    }

    return <>
        <div
            className={`group col-span-4 flex flex-col gap-2 p-2 border border-neutral-900 rounded-md cursor-pointer bg-neutral-800`}>
            <span className='group-hover:text-white flex items-center gap-1 text-sm text-neutral-400 whitespace-nowrap'
                  onClick={openOrClose}>Change Owner {isLoading && <Loading percent={80}/>}</span>
            {
                isOpen && <InputContainer handler={handler}
                                          submit={submit}
                                          type="string"
                                          placeholder='The Desired Maturit Period In Blocks'/>
            }
        </div>
    </>
}

function InputContainer({handler, maxValue, symbol, submit, placeholder, type}: {
    handler: Array<any>,
    type?: string,
    maxValue?: number,
    symbol?: string,
    placeholder?: string
    submit: any
}) {
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

    return <>
        <div className='flex flex-col gap-1 '>
            <div
                className='flex justify-between items-center gap-2 bg-neutral-950 border border-neutral-700 rounded-md w-full'>
                <input type="text"
                       className='w-full bg-transparent placeholder:text-sm px-2'
                       value={value || ""}
                       onChange={change}
                       placeholder={placeholder}/>
                {symbol && <span className='text-sm text-neutral-400 font-medium'>{symbol}</span>}
                <span className='bg-white text-black px-2 py-1 rounded-r-md hover:bg-green-300'
                      onClick={submit}>Submit</span>
            </div>
            {Boolean(maxValue) && <Percentages setter={setPercentage}/>}
        </div>

    </>
}



function useWithdrawExcessInterest(contractInfo: ContractExtendedInfoFormat) {
    const [contractAddress, chainId] = contractInfo._id.split("_");
    const chain = getChain(chainId);

    const config = getContractInfoByType(chain, TxTypes.WithdrawExcessPayout, {contractAddress})
    const transaction = useSendTransaction({
        to: config.to,
        value: config.value,
        data: config.data
    })

    return {
        sendTransactionAsync: async () => {
            try {
                const response = await transaction.sendTransactionAsync();
                await trackTransaction(chain, response.hash);
            } catch (error) {
                console.log(error)
            }
        },
        isLoading: transaction.isLoading
    }
}
