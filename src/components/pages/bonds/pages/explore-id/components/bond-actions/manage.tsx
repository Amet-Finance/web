import {BondInfoDetailed, TokenInfo} from "@/modules/web3/type";
import {useRef, useState} from "react";
import {TxTypes} from "@/modules/web3/constants";
import {toast} from "react-toastify";
import {getUtils, toBN} from "@/modules/web3/util";
import {useNetwork, useSendTransaction} from "wagmi";
import {getContractInfoByType, trackTransaction} from "@/modules/web3";
import {Tokens} from "@/components/pages/bonds/pages/issue/type";
import Loading from "@/components/utils/loading";

export default function Manage({info, tokens}: { info: BondInfoDetailed, tokens: { [key: string]: TokenInfo } }) {

    const issueBonds = useRef(null)
    const burnBonds = useRef(null)


    return <>
        <div className="flex flex-col gap-4 text-sm">
            <WithdrawRemaining bondInfo={info}/>
            <Deposit bondInfo={info} tokens={tokens}/>
            <ChangeOwner bondInfo={info}/>
            <IssueBonds bondInfo={info}/>
            <div className='flex gap-2 justify-between items-center border border-solid border-w1 rounded'>
                <input type="number" ref={burnBonds} className='px-2 w-full bg-transparent'/>
                <button className="px-2 py-1 border border-l-2 border-w1">Burn bonds</button>
            </div>
        </div>
    </>
}


function Deposit({bondInfo, tokens}: { bondInfo: BondInfoDetailed, tokens: Tokens }) {

    const {_id, interestToken} = bondInfo;
    const {chain} = useNetwork();
    const [amount, setAmount] = useState(0)

    const interestTokenInfo = tokens[interestToken]

    const config = {
        contractAddress: interestToken,
        toAddress: _id,
        amount: toBN(amount).mul(toBN(10).pow(toBN(interestTokenInfo?.decimals || 18)))
    }
    const contractInfo = getContractInfoByType(chain, TxTypes.TransferERC20, config)
    const {isLoading, sendTransactionAsync, data} = useSendTransaction({
        to: contractInfo.to,
        value: BigInt(contractInfo.value || 0) || undefined,
        data: contractInfo.data,
    })

    const changeAmount = (event: any) => setAmount(event.target.value)

    async function deposit() {
        try {
            if (!interestTokenInfo) {
                return toast.error('Interest token Meta Data is missing!');
            }

            if (!amount) {
                return toast.error('Please fill the amount field!');
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
                className="flex justify-center items-center gap-2 px-2 py-1 border border-l-2 border-w1 hover:bg-white hover:text-black"
                onClick={deposit}>Deposit {isLoading && <Loading percent={70}/>}</button>
        </div>
    </>
}

function WithdrawRemaining({bondInfo}: { bondInfo: BondInfoDetailed }) {

    const {_id, interestToken} = bondInfo;
    const {chain} = useNetwork();

    const config = {contractAddress: _id,}
    const contractInfo = getContractInfoByType(chain, TxTypes.WithdrawRemaining, config)
    const {isLoading, sendTransactionAsync, data} = useSendTransaction({
        to: contractInfo.to,
        value: BigInt(contractInfo.value || 0) || undefined,
        data: contractInfo.data,
    })

    async function withdrawRemaining() {
        try {
            const response = await sendTransactionAsync();
            await trackTransaction(chain, response.hash)
        } catch (error) {

        }
    }

    return <>
        <button
            className="flex justify-center items-center gap-2 px-2 py-1 border border-solid border-w1 rounded hover:bg-white hover:text-black whitespace-nowrap"
            onClick={withdrawRemaining}>
            Withdraw Remaining {isLoading && <Loading percent={70}/>}
        </button>
    </>
}

function ChangeOwner({bondInfo}: { bondInfo: BondInfoDetailed }) {

    const {_id, interestToken} = bondInfo;
    const {chain} = useNetwork();
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
    })

    const onChange = (event: any) => setChangeAddress(event.target.value)

    async function changeOwner() {
        try {
            const {toChecksumAddress} = getUtils()
            toChecksumAddress(newAddress);

            const response = await sendTransactionAsync();
            await trackTransaction(chain, response.hash);
        } catch (error: any) {
            toast.error(error.message)
        }
    }

    return <>
        <div className='flex gap-2 justify-between items-center border border-solid border-w1 rounded'>
            <input type="text" className='px-2 w-full bg-transparent' onChange={onChange}/>
            <button
                className="flex justify-center items-center gap-2 px-2 py-1 border border-l-2 border-w1 whitespace-nowrap hover:bg-white hover:text-black"
                onClick={changeOwner}>Change Owner {isLoading && <Loading percent={70}/>}
            </button>
        </div>
    </>
}

function IssueBonds({bondInfo}: { bondInfo: BondInfoDetailed }) {

    const {_id} = bondInfo;
    const {chain} = useNetwork();
    const [amount, setAmount] = useState(0)


    const contractInfo = getContractInfoByType(chain, TxTypes.IssueMoreBonds, {
        contractAddress: _id,
        amount
    })
    const {isLoading, sendTransactionAsync, data} = useSendTransaction({
        to: contractInfo.to,
        value: BigInt(contractInfo.value || 0) || undefined,
        data: contractInfo.data,
    })

    const changeAmount = (event: any) => setAmount(event.target.value)

    async function issueMoreBonds() {
        try {
            if (!amount) {
                return toast.error('Please fill the amount field!');
            }

            const response = await sendTransactionAsync();
            await trackTransaction(chain, response.hash)
        } catch (error) {

        }
    }

    return <>
        <div className='flex gap-2 justify-between items-center border border-solid border-w1 rounded'>
            <input type="number" onChange={changeAmount} className='px-2 w-full bg-transparent'/>
            <button className="flex items-center justify-center gap-2 px-2 py-1 border border-l-2 border-w1 whitespace-nowrap hover:bg-white hover:text-white"
                    onClick={issueMoreBonds}>Issue bonds {isLoading && <Loading percent={70}/>}</button>
        </div>
    </>
}
