import {useEffect, useState} from "react";
import {DetailedBondResponse} from "@/modules/cloud-api/type";
import {getProvider} from "@/modules/web3";
import {getChain} from "@/modules/utils/wallet-connect";
import {ZERO_ADDRESS} from "@/modules/web3/constants";
import {shorten} from "@/modules/web3/util";
import Link from "next/link";
import {Chain} from "wagmi";
import RefreshSVG from "../../../../../../../public/svg/utils/refresh";
import Loading from "@/components/utils/loading";
import {ActivityLog, ActivityLogs} from './types'
import {getTransferActivity} from "@/modules/web3/zcb";
import {toast} from "react-toastify";


export default function RecentActivity({bondInfo}: { bondInfo: DetailedBondResponse }) {

    const {contractInfo} = bondInfo;
    const chain: any = getChain(contractInfo.chainId);

    const [activity, setActivity] = useState({} as ActivityLogs)
    const [isLoading, setLoading] = useState(false);
    const [refresh, setRefresh] = useState(0);


    useEffect(() => {


        async function initiate() {

            let concat: ActivityLogs = {};
            if (isLoading) {
                return toast.error("Already loading")
            }

            setLoading(true);


            if (contractInfo.purchased) {
                const provider = getProvider(chain);
                const currentBlock = await provider.getBlockNumber();


                console.time('Finished fetching events')
                const INTERPRETER = BigInt(1024)
                const MIN_BLOCK = BigInt(contractInfo.issuanceBlock);

                for (let block = currentBlock; block > MIN_BLOCK; block -= INTERPRETER) {
                    console.log(`fromBlock: ${block - INTERPRETER}, toBlock: ${block}`)
                    const results = await getTransferActivity(chain, contractInfo._id, block - INTERPRETER, block);


                    if (results.length) {
                        const mappedResults = results.reduce((acc: any, item: any) => {

                            const transactionHash = item.transactionHash;
                            const tokenId = Number(item.args[2]);

                            if (!acc[transactionHash]) {
                                acc[transactionHash] = {
                                    from: item.args[0],
                                    to: item.args[1],
                                    blockNumber: Number(item.blockNumber),
                                    transactionHash,
                                    tokenIds: [tokenId]
                                }

                            } else {
                                acc[transactionHash].tokenIds.push(tokenId)
                            }

                            return acc;
                        }, {} as any)

                        concat = {...concat, ...mappedResults};
                        setActivity({...concat});
                    }
                }

                console.timeEnd('Finished fetching events')
            }

            setLoading(false)
        }


        initiate()
    }, [contractInfo.purchased, contractInfo.redeemed, refresh])


    const activityParsed = Object.values(activity).sort((a, b) => b.blockNumber - a.blockNumber);
    const showLoading = isLoading && !activityParsed.length

    return <>
        <div className='flex flex-col bg-d-1 w-full gap-4 rounded-xl md:px-4 py-4'>
            <div className='flex justify-between items-center w-full px-5'>
                <span className='text-xl font-bold'>Recent Activity</span>
                <div className='flex items-center gap-1'>
                    <RefreshSVG isSmall={true} isLoading={isLoading} onClick={() => setRefresh(Math.random())}/>
                </div>
            </div>
            {
                showLoading ?
                    <Loading/> :
                    <ActivityLogContainer activityParsed={activityParsed} chain={chain}/>
            }
        </div>
    </>
}


function ActivityLogContainer({activityParsed, chain}: { activityParsed: ActivityLog[], chain: Chain }) {
    return <>
        <div className='flex flex-col gap-2 px-5'>
            <div className='grid md:grid-cols-6 sm:grid-cols-3 gap-2'>
                <span className='md:flex sm:hidden'>Block</span>
                <span>Type</span>
                <span className='md:flex sm:hidden'>From</span>
                <span className='md:flex sm:hidden'>To</span>
                <span>Quantity</span>
                <span>Transaction Hash</span>
            </div>
            <div className='grid md:grid-cols-6 sm:grid-cols-3 gap-2 border-t-2 border-w1 overflow-y-auto max-h-52 py-2'>
                {activityParsed.map((log, index) => <ActivityLog key={index}
                                                                 chain={chain} log={log}
                                                                 index={index}/>)}
            </div>
        </div>
    </>
}

function ActivityLog({chain, log, index}: { log: ActivityLog, chain: Chain, index: number }) {

    const {
        from,
        to,
        tokenIds,
        transactionHash,
        blockNumber,
    } = log;


    const isPurchased = from === ZERO_ADDRESS;
    const isRedeemed = to === ZERO_ADDRESS;
    const type = isPurchased ? "Purchase" : (isRedeemed ? "Redeem" : "Transfer");

    let typeClass = isPurchased ? 'text-red-500' : (isRedeemed ? "text-green-500" : "text-neutral-500")

    const explorerAddress = chain.blockExplorers?.default.url
    const blockLink = `${explorerAddress}/block/${blockNumber}`
    const fromLink = `${explorerAddress}/address/${from}`
    const toLink = `${explorerAddress}/address/${to}`
    const txLink = `${explorerAddress}/tx/${transactionHash}`;


    const addressParser = (address: string) => address === ZERO_ADDRESS ? "" : shorten(address, 4)

    return <>
        <Link href={blockLink} target='_blank' className='text-neutral-300 md:flex sm:hidden'>
            <span>{blockNumber}</span>
        </Link>
        <span className={typeClass}>{type}</span>
        <Link href={fromLink} target='_blank' className='text-blue-500 md:flex sm:hidden'>
            <span>{addressParser(from)}</span>
        </Link>
        <Link href={toLink} target='_blank' className='text-blue-500 md:flex sm:hidden'>
            <span>{addressParser(to)}</span>
        </Link>
        <span title={tokenIds.join(", ")}>{tokenIds.length}</span>
        <Link href={txLink} target='_blank' className='text-blue-500'>
            <span>{shorten(transactionHash, 3)}</span>
        </Link>
    </>
}
