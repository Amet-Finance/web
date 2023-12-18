import {useEffect, useState} from "react";
import {TxTypes} from "@/modules/web3/constants";
import {toast} from "react-toastify";
import {useNetwork, useSendTransaction, useSwitchNetwork} from "wagmi";
import {getContractInfoByType, trackTransaction} from "@/modules/web3";
import Loading from "@/components/utils/loading";
import {getChain} from "@/modules/utils/wallet-connect";
import {DetailedBondResponse} from "@/modules/cloud-api/type";
import {divBigNumber, format, mulBigNumber} from "@/modules/utils/numbers";
import {dayInSec, formatTime, hourInSec, monthInSec, yearInSec} from "@/modules/utils/dates";
import {getAddress} from "viem";
import {ModalTypes} from "@/store/redux/modal/constants";
import {openModal} from "@/store/redux/modal";

export default function Manage({bondInfo}: { bondInfo: DetailedBondResponse }) {

    return <>
        <div className="flex flex-col gap-4 text-sm pb-4">
            <EditDescription bondInfo={bondInfo}/>
            <WithdrawRemaining bondInfo={bondInfo}/>
            <InputContainer>
                <Deposit bondInfo={bondInfo}/>
            </InputContainer>
            <InputContainer>
                <ChangeOwner bondInfo={bondInfo}/>
            </InputContainer>
            <InputContainer>
                <IssueBonds bondInfo={bondInfo}/>
            </InputContainer>
            <InputContainer>
                <BurnUnsoldBonds bondInfo={bondInfo}/>
            </InputContainer>
            <InputContainer>
                <DecreaseRedeemLockPeriod bondInfo={bondInfo}/>
            </InputContainer>
        </div>
    </>
}

function InputContainer({children}: any) {
    return <>
        <div className='relative grid grid-cols-6 border border-w1 rounded hover:border-w3'>
            {children}
        </div>
    </>
}

function EditDescription({bondInfo}: { bondInfo: DetailedBondResponse }) {
    return <>
        <button
            onClick={() => openModal(ModalTypes.BondEditDescription, {bondInfo})}
            className="flex items-center gap-2 px-2 py-1 border border-solid border-w1 rounded hover:border-w3 whitespace-nowrap text-center">
            Update Bond Description
        </button>
    </>
}

function WithdrawRemaining({bondInfo}: { bondInfo: DetailedBondResponse }) {

    const {contractInfo} = bondInfo;
    const {
        _id,
        chainId,
        interestToken,
        interestTokenInfo,
        interestTokenBalance,
        interestTokenAmount,
        total,
        purchased,
        redeemed
    } = contractInfo;
    const network = useNetwork();
    const {switchNetworkAsync} = useSwitchNetwork();
    const chain = getChain(chainId);

    const interestAmount = divBigNumber(interestTokenAmount, interestTokenInfo.decimals).toNumber()
    const remainingAmount = (interestTokenBalance?.balanceClean || 0) - ((total - redeemed) * interestAmount);
    const hasRemaining = remainingAmount > 0;


    const config = {contractAddress: _id,}
    const contractInfoData = getContractInfoByType(chain, TxTypes.WithdrawRemaining, config)
    const {isLoading, sendTransactionAsync, data} = useSendTransaction({
        to: contractInfoData.to,
        value: BigInt(contractInfoData.value || 0) || undefined,
        data: contractInfoData.data,
        chainId
    })

    async function withdrawRemaining() {
        try {
            if (!hasRemaining) {
                return;
            }

            if (chain?.id !== network.chain?.id) {
                await switchNetworkAsync?.(chain?.id)
            }

            const response = await sendTransactionAsync();
            await trackTransaction(chain, response.hash)
        } catch (error) {

        }
    }

    return <>
        <button
            className={
                "flex items-center gap-2 px-2 py-1 border border-solid border-w1 rounded hover:border-w3 whitespace-nowrap text-center " + (!hasRemaining ? "cursor-not-allowed " : "")}
            onClick={withdrawRemaining}>
            Withdraw Remaining
            <span
                className={hasRemaining ? "text-green-500 font-medium" : "text-g"}>({format(remainingAmount)} {interestTokenInfo?.symbol})</span>
            {
                isLoading && <Loading percent={70}/>
            }
        </button>
    </>
}

function Deposit({bondInfo}: { bondInfo: DetailedBondResponse }) {
    const {contractInfo} = bondInfo
    const {_id, chainId, interestToken, interestTokenInfo, total, redeemed, interestTokenAmount} = contractInfo;

    const interestAmount = divBigNumber(interestTokenAmount, interestTokenInfo.decimals).toNumber()
    const totalNeeded = (total - redeemed) * interestAmount;

    const [amount, setAmount] = useState(0);
    const network = useNetwork();
    const {switchNetworkAsync} = useSwitchNetwork();


    const decimals = interestTokenInfo?.decimals;

    const chain = getChain(chainId);
    const config = {
        contractAddress: interestToken,
        toAddress: _id,
        amount: mulBigNumber(amount, decimals, true).toNumber()
    }

    const contractInfoData = getContractInfoByType(chain, TxTypes.TransferERC20, config);
    const {isLoading, sendTransactionAsync, data} = useSendTransaction({
        to: contractInfoData.to,
        value: BigInt(contractInfoData.value || 0),
        data: contractInfoData.data
    })

    const changeByPercentage = (percentage: number) => setAmount(Math.round((totalNeeded * percentage) / 100))
    const changeAmount = (event: any) => setAmount(event.target.value || 0)

    async function deposit() {
        try {

            if (!interestTokenInfo) {
                return toast.error('Interest token Meta Data is missing!');
            }

            if (!amount) {
                return toast.error('Please fill the amount field!');
            }

            if (network.chain?.id !== chain?.id) {
                await switchNetworkAsync?.(chain?.id)
            }

            const response = await sendTransactionAsync();
            await trackTransaction(chain, response.hash)
        } catch (error) {

        }
    }

    return <>
        <div className='flex md:flex-col sm:flex-row px-2 py-1 gap-2 w-full col-span-4'>
                <input type="number" className='w-full bg-transparent text-g'
                       placeholder="Deposit Interest Tokens"
                       onChange={changeAmount}
                       value={amount || ""}
                />
                <div className='flex gap-2 items-center text-xs w-full'>
                    <button className='border border-w1 px-2' onClick={() => changeByPercentage(10)}>10%</button>
                    <button className='border border-w1 px-2' onClick={() => changeByPercentage(30)}>30%</button>
                    <button className='border border-w1 px-2' onClick={() => changeByPercentage(50)}>50%</button>
                    <button className='border border-w1 px-2' onClick={() => changeByPercentage(100)}>100%</button>
                </div>
            </div>
            <button
                className="flex justify-center items-center gap-2 px-2 py-1  w-full border-w1 text-end col-span-2 bg-neutral-900"
                onClick={deposit}>Deposit Interest {isLoading && <Loading percent={70}/>}</button>
    </>
}

function ChangeOwner({bondInfo}: { bondInfo: DetailedBondResponse }) {

    const {contractInfo} = bondInfo;
    const {_id, chainId} = contractInfo;
    const network = useNetwork();
    const {switchNetworkAsync} = useSwitchNetwork();
    const chain = getChain(chainId);
    const [newAddress, setChangeAddress] = useState("")


    const config = {
        contractAddress: _id,
        newAddress
    }
    const contractInfoData = getContractInfoByType(chain, TxTypes.ChangeOwner, config)
    const {isLoading, sendTransactionAsync, data} = useSendTransaction({
        to: contractInfoData.to,
        value: BigInt(contractInfoData.value || 0) || undefined,
        data: contractInfoData.data,
        chainId
    })

    const onChange = (event: any) => setChangeAddress(event.target.value)

    async function changeOwner() {
        try {
            getAddress(newAddress);

            if (chain?.id !== network.chain?.id) {
                await switchNetworkAsync?.(chain?.id)
            }

            const response = await sendTransactionAsync();
            await trackTransaction(chain, response.hash);
        } catch (error: any) {
            toast.error(error.message)
        }
    }

    return <>

        <input type="text" className='px-2 w-full bg-transparent col-span-4' onChange={onChange}
                   placeholder='Enter the new owner address'
            />
            <button
                className="flex justify-center items-center gap-2 px-2 py-1 w-full whitespace-nowrap hover:border-w3 col-span-2 bg-neutral-900"
                onClick={changeOwner}>Change Owner {isLoading && <Loading percent={70}/>}
            </button>
    </>
}

function IssueBonds({bondInfo}: { bondInfo: DetailedBondResponse }) {

    const {contractInfo} = bondInfo;
    const {_id, chainId} = contractInfo;
    const network = useNetwork();
    const {switchNetworkAsync} = useSwitchNetwork();
    const chain = getChain(chainId);
    const [amount, setAmount] = useState(0)


    const contractInfoData = getContractInfoByType(chain, TxTypes.IssueMoreBonds, {
        contractAddress: _id,
        amount
    })
    const {isLoading, sendTransactionAsync, data} = useSendTransaction({
        to: contractInfoData.to,
        value: BigInt(contractInfoData.value || 0) || undefined,
        data: contractInfoData.data,
        chainId
    })

    const changeAmount = (event: any) => setAmount(event.target.value)

    async function issueMoreBonds() {
        try {
            if (!amount) {
                return toast.error('Please fill the amount field!');
            }

            if (chain?.id !== network.chain?.id) {
                await switchNetworkAsync?.(chain?.id)
            }

            const response = await sendTransactionAsync();
            await trackTransaction(chain, response.hash)
        } catch (error) {

        }
    }

    return <>
        <input type="number" onChange={changeAmount} className='px-2 w-full bg-transparent col-span-4'
                   placeholder='The amount of bonds you want to issue'/>
            <button
                className="flex items-center justify-center gap-2 px-2 py-1 whitespace-nowrap col-span-2 bg-neutral-900"
                onClick={issueMoreBonds}>Issue More bonds {isLoading && <Loading percent={70}/>}
            </button>
    </>
}

function BurnUnsoldBonds({bondInfo}: { bondInfo: DetailedBondResponse }) {
    const {contractInfo} = bondInfo;
    const {_id, chainId} = contractInfo;
    const network = useNetwork();
    const {switchNetworkAsync} = useSwitchNetwork();
    const chain = getChain(chainId);
    const [amount, setAmount] = useState(0)

    const config = {
        contractAddress: _id,
        amount
    }
    const contractInfoData = getContractInfoByType(chain, TxTypes.BurnUnsoldBonds, config)
    const {isLoading, sendTransactionAsync, data} = useSendTransaction({
        to: contractInfoData.to,
        value: BigInt(contractInfoData.value || 0) || undefined,
        data: contractInfoData.data,
        chainId
    })

    const changeAmount = (event: any) => setAmount(event.target.value)

    async function burnUnsoldBonds() {
        try {
            if (!amount) {
                return toast.error('Please fill the amount field!');
            }

            if (network.chain?.id !== chain?.id) {
                await switchNetworkAsync?.(chain?.id);
            }

            const response = await sendTransactionAsync();
            await trackTransaction(chain, response.hash)
        } catch (error) {

        }
    }

    return <>
        <input type="number" className='px-2 w-full bg-transparent text-g col-span-4'
                   placeholder="The amount of bonds you want to burn"
                   onChange={changeAmount}/>
            <button
                className="flex justify-center items-center gap-2 px-2 py-1 whitespace-nowrap col-span-2 bg-neutral-900"
                onClick={burnUnsoldBonds}>Burn Unsold Bonds {isLoading && <Loading percent={70}/>}</button>
    </>
}

function DecreaseRedeemLockPeriod({bondInfo}: { bondInfo: DetailedBondResponse }) {

    const {contractInfo} = bondInfo
    const {chainId} = contractInfo;
    const network = useNetwork();
    const {switchNetworkAsync} = useSwitchNetwork();
    const chain = getChain(chainId);
    const [total, setTotal] = useState<number | undefined>()
    const [timer, setTimer] = useState({
        hour: 0,
        day: 0,
        month: 0,
        year: 0
    })

    const change = (event: any) => {
        setTimer({
            ...timer,
            [event.target.id]: Number(event.target.value)
        })
    }

    const focusInnerInput = (event: Event | any) => {
        const input = event.currentTarget.querySelector('input');
        if (input) {
            input.focus();
        }
    }


    const config = {
        contractAddress: contractInfo._id,
        newPeriod: total
    }
    const contractInfoData = getContractInfoByType(chain, TxTypes.DecreaseRedeemLockPeriod, config)
    const {isLoading, sendTransactionAsync, data} = useSendTransaction({
        to: contractInfoData.to,
        value: BigInt(contractInfoData.value || 0) || undefined,
        data: contractInfoData.data,
        chainId
    })

    async function decrease() {
        try {
            if (total) {

                if (chain?.id !== network.chain?.id) {
                    await switchNetworkAsync?.(chain?.id);
                }

                const response = await sendTransactionAsync();
                await trackTransaction(chain, response.hash)
            }
        } catch (error: any) {
            console.error(error.message)
        }
    }

    useEffect(() => {
        if (timer.hour || timer.day || timer.month || timer.year) {
            const action = setTimeout(() => {
                let total = 0
                total += (timer.hour || 0) * hourInSec
                total += (timer.day || 0) * dayInSec
                total += (timer.month || 0) * monthInSec
                total += (timer.year || 0) * yearInSec

                setTotal(total)
            }, 100)

            return () => {
                clearTimeout(action)
            }
        }
    }, [timer])


    return <>
        <div
            className="flex flex-col items-center justify-center bg-transparent border-r-2 border-w1 text-white text-xs h-full"
            onClick={focusInnerInput}>
            <span className="text-g3">Hour</span>
            <input type="number"
                   className="bg-transparent text-white w-full max-w-[50px] text-center"
                   id='hour' defaultValue={timer.hour}
                   onChange={change}/>
        </div>
        <div
            className="flex flex-col items-center justify-center bg-transparent border-r-2 border-w1 text-white text-xs h-full"
            onClick={focusInnerInput}>
            <span className="text-g3">Day</span>
            <input type="number" className="bg-transparent text-white max-w-[50px] text-center" id='day'
                   defaultValue={timer.day}
                   onChange={change}/>
        </div>
        <div
            className="flex flex-col items-center justify-center bg-transparent border-r-2 border-w1 text-white text-xs h-full"
            onClick={focusInnerInput}>
            <span className="text-g3">Month</span>
            <input type="number" className="bg-transparent text-white max-w-[50px] text-center" id='month'
                   defaultValue={timer.month}
                   onChange={change}/>
        </div>
        <div
            className="flex flex-col items-center justify-center bg-transparent text-white text-xs h-full"
            onClick={focusInnerInput}>
            <span className="text-g3">Year</span>
            <input type="number" className="bg-transparent text-white max-w-[50px] text-center" id='year'
                   defaultValue={timer.year}
                   onChange={change}/>
        </div>
        <button
            className="flex justify-center items-center gap-2 px-2 py-1 hover:border-w3  bg-neutral-900 col-span-2"
            onClick={decrease}>Decrease Lock Period {isLoading && <Loading percent={70}/>}</button>
        {
            Number.isFinite(Number(total)) &&
            <span className='absolute top-[110%] left-0 text-g text-xs'>New Lock Period: {formatTime(Number(total), true)}</span>
        }
    </>
}
