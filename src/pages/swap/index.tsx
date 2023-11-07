import SettingsSVG from "../../../public/svg/settings";
import {useEffect, useState} from "react";
import {requestAPI} from "@/modules/cloud-api/util";
import {useAccount, useNetwork} from "wagmi";

export default function SwapPage() {

    const {chain} = useNetwork();
    const {address} = useAccount();
    const [from, setFrom] = useState({
        amount: 0
    })
    const [result, setResult] = useState({})

    const amountIn = from.amount * 1000000000000000000
    const tokenIn = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2".toLowerCase()
    const tokenOut = "0xdac17f958d2ee523a2206206994597c13d831ec7".toLowerCase()

    function onChange(event: any) {
        const {id, value} = event.target;
        if (id.startsWith('from')) {
            if (id.endsWith('Amount')) {
                setFrom({
                    ...from,
                    amount: Number(value) || 0
                })
            } else {

            }

        } else {
            if (id.endsWith('Amount')) {

            } else {

            }
        }

    }

    useEffect(() => {
        const interval = setInterval(() => {

            requestAPI({
                url: `https://aggregator-api.kyberswap.com/${chain?.name.toLowerCase()}/route/encode`,
                params: {
                    tokenIn,
                    tokenOut,
                    amountIn,
                    to: address
                },
                headers: {
                    "Accept-Version": "Latest"
                }
            }).then(data => {
                setResult(data);
            })
        }, 5000)

        return () => clearInterval(interval)
    }, [from]);

    console.log(`result`, result);

    // const outputTokenDecimals = result?.tokens?.[tokenOut].decimals
    // const output = result?.outputAmount / 10 ** outputTokenDecimals

    return <>
        {/*<div className='flex items-center justify-center w-full'>*/}
        {/*    <div className='flex flex-col gap-2 w-40 bg-b1  min-w-500 rounded'>*/}
        {/*        <div className='flex flex-col gap-2 px-4 py-5'>*/}
        {/*            <div className='flex justify-between items-center gap-10 w-full'>*/}
        {/*                <span className='text-xl'>You Pay</span>*/}
        {/*                <SettingsSVG/>*/}
        {/*            </div>*/}
        {/*            <div className='flex justify-between items-center'>*/}
        {/*                <div className='flex flex-col gap-2'>*/}
        {/*                    <input type="number" placeholder='The amount to swap'*/}
        {/*                           className='bg-transparent rounded w-full text-lg'*/}
        {/*                           id='fromAmount'*/}
        {/*                           onChange={onChange}*/}
        {/*                           autoFocus/>*/}
        {/*                    <span className='text-g2'>~$4,307</span>*/}
        {/*                </div>*/}
        {/*                <div className='flex border border-solid border-w1 p-2 rounded bg-b2'>*/}
        {/*                    <span>ETH</span>*/}
        {/*                </div>*/}
        {/*            </div>*/}
        {/*        </div>*/}
        {/*        <div className='flex flex-col gap-2 bg-b2 px-2 py-5 m-2 rounded'>*/}
        {/*            <span className='text-xl'>You Receive</span>*/}
        {/*            <div className='flex justify-between items-center'>*/}
        {/*                <div className='flex flex-col'>*/}
        {/*                    <span>{output}</span>*/}
        {/*                    <span className='text-g2'>~${result?.receivedUsd?.toFixed(2)}</span>*/}
        {/*                </div>*/}
        {/*                <div className='flex border border-solid border-w1 p-2 rounded bg-b2'>*/}
        {/*                    <span>DAI</span>*/}
        {/*                </div>*/}
        {/*            </div>*/}
        {/*            <div className="h-px w-full bg-g5"/>*/}
        {/*            <span>1ETH = 4031 DAI</span>*/}
        {/*            <div className='flex flex-col items-center gap-2'>*/}
        {/*                <button className='w-full bg-white  text-black rounded'>Swap</button>*/}
        {/*                <span className='text-xs'>Powered by KyberSwap</span>*/}
        {/*            </div>*/}
        {/*        </div>*/}

        {/*    </div>*/}
        {/*</div>*/}
    </>
}
