import {BondInfoDetailed} from "@/modules/web3/type";
import {useEffect, useState} from "react";
import {TxTypes} from "@/modules/web3/constants";
import {toast} from "react-toastify";
import {useNetwork, useSendTransaction, useSwitchNetwork} from "wagmi";
import {getContractInfoByType, trackTransaction} from "@/modules/web3";
import Loading from "@/components/utils/loading";
import {getChain} from "@/modules/utils/wallet-connect";
import {TokensResponse} from "@/modules/cloud-api/type";
import {mulBigNumber} from "@/modules/utils/numbers";
import {dayInSec, formatTime, hourInSec, monthInSec, yearInSec} from "@/modules/utils/dates";
import {getAddress} from "viem";

export default function Manage({info, tokens}: { info: BondInfoDetailed, tokens: TokensResponse }) {

    return <>
        <div className="flex flex-col gap-4 text-sm">
            <WithdrawRemaining bondInfo={info} tokens={tokens}/>
            <Deposit bondInfo={info} tokens={tokens}/>
            <ChangeOwner bondInfo={info}/>
            <IssueBonds bondInfo={info}/>
            <BurnUnsoldBonds bondInfo={info}/>
            <DecreaseRedeemLockPeriod bondInfo={info}/>
        </div>
    </>
}


function Deposit({bondInfo, tokens}: { bondInfo: BondInfoDetailed, tokens: TokensResponse }) {

    const {_id, chainId, interestToken} = bondInfo;
    const [amount, setAmount] = useState(0);
    const network = useNetwork();
    const {switchNetworkAsync} = useSwitchNetwork();


    const interestTokenInfo = tokens[interestToken.toLowerCase()]
    const decimals = interestTokenInfo?.decimals;

    const chain = getChain(chainId);
    const config = {
        contractAddress: interestToken,
        toAddress: _id,
        amount: mulBigNumber(amount, decimals, true).toNumber()
    }

    const contractInfo = getContractInfoByType(chain, TxTypes.TransferERC20, config);
    const {isLoading, sendTransactionAsync, data} = useSendTransaction({
        to: contractInfo.to,
        value: BigInt(contractInfo.value || 0),
        data: contractInfo.data
    })

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
        <div className='flex gap-2 justify-between items-center border border-solid border-w1 rounded'>
            <input type="number" className='px-2 w-full bg-transparent text-g'
                   placeholder="Enter deposit amount to increase Secured Percentage"
                   onChange={changeAmount}/>
            <button
                className="flex justify-center items-center gap-2 px-2 py-1 border border-l-2 border-w1 hover:bg-white hover:text-black min-w-[12rem]"
                onClick={deposit}>Deposit {isLoading && <Loading percent={70}/>}</button>
        </div>
    </>
}

function WithdrawRemaining({bondInfo, tokens}: { bondInfo: BondInfoDetailed, tokens: TokensResponse }) {

    const {_id, chainId, interestToken} = bondInfo;
    const network = useNetwork();
    const {switchNetworkAsync} = useSwitchNetwork();
    const chain = getChain(chainId);

    const interestTokenInfo = tokens[interestToken.toLowerCase()]
    const config = {contractAddress: _id,}
    const contractInfo = getContractInfoByType(chain, TxTypes.WithdrawRemaining, config)
    const {isLoading, sendTransactionAsync, data} = useSendTransaction({
        to: contractInfo.to,
        value: BigInt(contractInfo.value || 0) || undefined,
        data: contractInfo.data,
        chainId
    })

    async function withdrawRemaining() {
        try {
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
            className="flex justify-center items-center gap-2 px-2 py-1 border border-solid border-w1 rounded hover:bg-white hover:text-black whitespace-nowrap text-center"
            onClick={withdrawRemaining}>
            Withdraw Remaining {interestTokenInfo?.symbol} {isLoading && <Loading percent={70}/>}
        </button>
    </>
}

function ChangeOwner({bondInfo}: { bondInfo: BondInfoDetailed }) {

    const {_id, chainId} = bondInfo;
    const network = useNetwork();
    const {switchNetworkAsync} = useSwitchNetwork();
    const chain = getChain(chainId);
    const [newAddress, setChangeAddress] = useState("")


    const config = {
        contractAddress: _id,
        newAddress
    }
    const contractInfo = getContractInfoByType(chain, TxTypes.ChangeOwner, config)
    const {isLoading, sendTransactionAsync, data} = useSendTransaction({
        to: contractInfo.to,
        value: BigInt(contractInfo.value || 0) || undefined,
        data: contractInfo.data,
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
        <div className='flex gap-2 justify-between items-center border border-solid border-w1 rounded'>
            <input type="text" className='px-2 w-full bg-transparent' onChange={onChange}
                   placeholder='Enter the new owner address'
            />
            <button
                className="flex justify-center items-center gap-2 px-2 py-1 border border-l-2 border-w1 whitespace-nowrap hover:bg-white hover:text-black min-w-[12rem]"
                onClick={changeOwner}>Change Owner {isLoading && <Loading percent={70}/>}
            </button>
        </div>
    </>
}

function IssueBonds({bondInfo}: { bondInfo: BondInfoDetailed }) {

    const {_id, chainId} = bondInfo;
    const network = useNetwork();
    const {switchNetworkAsync} = useSwitchNetwork();
    const chain = getChain(chainId);
    const [amount, setAmount] = useState(0)


    const contractInfo = getContractInfoByType(chain, TxTypes.IssueMoreBonds, {
        contractAddress: _id,
        amount
    })
    const {isLoading, sendTransactionAsync, data} = useSendTransaction({
        to: contractInfo.to,
        value: BigInt(contractInfo.value || 0) || undefined,
        data: contractInfo.data,
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
        <div className='flex gap-2 justify-between items-center border border-solid border-w1 rounded'>
            <input type="number" onChange={changeAmount} className='px-2 w-full bg-transparent'
                   placeholder='The amount of bonds you want to issue'/>
            <button
                className="flex items-center justify-center gap-2 px-2 py-1 border border-l-2 border-w1 whitespace-nowrap hover:bg-white hover:text-black min-w-[12rem]"
                onClick={issueMoreBonds}>Issue More bonds
            </button>
        </div>
    </>
}

function BurnUnsoldBonds({bondInfo}: { bondInfo: BondInfoDetailed }) {
    const {_id, chainId} = bondInfo;
    const network = useNetwork();
    const {switchNetworkAsync} = useSwitchNetwork();
    const chain = getChain(chainId);
    const [amount, setAmount] = useState(0)

    const config = {
        contractAddress: _id,
        amount
    }
    const contractInfo = getContractInfoByType(chain, TxTypes.BurnUnsoldBonds, config)
    const {isLoading, sendTransactionAsync, data} = useSendTransaction({
        to: contractInfo.to,
        value: BigInt(contractInfo.value || 0) || undefined,
        data: contractInfo.data,
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
        <div className='flex gap-2 justify-between items-center border border-solid border-w1 rounded'>
            <input type="number" className='px-2 w-full bg-transparent text-g'
                   placeholder="The amount of bonds you want to burn"
                   onChange={changeAmount}/>
            <button
                className="flex justify-center items-center gap-2 px-2 py-1 border whitespace-nowrap border-l-2 border-w1 hover:bg-white hover:text-black min-w-[12rem]"
                onClick={burnUnsoldBonds}>Burn Unsold Bonds {isLoading && <Loading percent={70}/>}</button>
        </div>
    </>
}

function DecreaseRedeemLockPeriod({bondInfo}: { bondInfo: BondInfoDetailed }) {

    const {chainId} = bondInfo;
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
        contractAddress: bondInfo._id,
        newPeriod: total
    }
    const contractInfo = getContractInfoByType(chain, TxTypes.DecreaseRedeemLockPeriod, config)
    const {isLoading, sendTransactionAsync, data} = useSendTransaction({
        to: contractInfo.to,
        value: BigInt(contractInfo.value || 0) || undefined,
        data: contractInfo.data,
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
        <div className='flex flex-col w-full gap-2'>
            <div className="flex gap-2 justify-between w-full">
                <div className="flex items-center justify-between w-full h-full gap-1">
                    <div
                        className="flex flex-col items-center justify-center bg-transparent border border-w1 border-solid rounded text-white text-xs h-full"
                        onClick={focusInnerInput}>
                        <span className="text-g3">Hour</span>
                        <input type="number"
                               className="bg-transparent text-white w-full max-w-[50px] text-center"
                               id='hour' defaultValue={timer.hour}
                               onChange={change}/>
                    </div>
                    <div
                        className="flex flex-col items-center justify-center bg-transparent border border-w1 border-solid rounded text-white text-xs h-full"
                        onClick={focusInnerInput}>
                        <span className="text-g3">Day</span>
                        <input type="number" className="bg-transparent text-white max-w-[50px] text-center" id='day'
                               defaultValue={timer.day}
                               onChange={change}/>
                    </div>
                    <div
                        className="flex flex-col items-center justify-center bg-transparent border border-w1 border-solid rounded text-white text-xs h-full"
                        onClick={focusInnerInput}>
                        <span className="text-g3">Month</span>
                        <input type="number" className="bg-transparent text-white max-w-[50px] text-center" id='month'
                               defaultValue={timer.month}
                               onChange={change}/>
                    </div>
                    <div
                        className="flex flex-col items-center justify-center bg-transparent border border-w1 border-solid rounded text-white text-xs h-full"
                        onClick={focusInnerInput}>
                        <span className="text-g3">Year</span>
                        <input type="number" className="bg-transparent text-white max-w-[50px] text-center" id='year'
                               defaultValue={timer.year}
                               onChange={change}/>
                    </div>
                </div>
                <button
                    className="flex justify-center items-center gap-2 px-2 py-1 border whitespace-nowrap border-l-2 border-w1 hover:bg-white hover:text-black min-w-[12rem] rounded"
                    onClick={decrease}>Decrease Lock Period {isLoading && <Loading percent={70}/>}</button>
            </div>
            {
                Number.isFinite(Number(total)) &&
                <span className='text-g'>New Lock Period: {formatTime(Number(total), true)}</span>
            }
        </div>
    </>
}
