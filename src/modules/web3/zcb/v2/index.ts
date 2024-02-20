import {Chain} from "wagmi";
import {getProvider} from "@/modules/web3";
import {encodeFunctionData, getContract, isAddress} from "viem";
import ZCB_ABI from "@/modules/web3/abi-jsons/ZCB_V1.json";
import {ZERO_ADDRESS} from "@/modules/web3/constants";

function getContractInstance(chain: Chain, contractAddress: string) {
    const provider = getProvider(chain)
    return getContract({
        address: contractAddress as any,
        abi: ZCB_ABI,
        publicClient: provider
    })
}

function purchase(chain: Chain, contractAddress: string, count: number, referrer?: string) {
    const instance = getContractInstance(chain, contractAddress)
    const referrerAddress = Boolean(referrer && isAddress(referrer)) ? referrer : ZERO_ADDRESS

    return encodeFunctionData({
        abi: instance.abi,
        functionName: 'purchase',
        args: [
            BigInt(count),
            referrerAddress
        ]
    })
}

function redeem(chain: Chain, contractAddress: string, bondIndexes: string[], redemptionCount: number, isCapitulation?: boolean) {
    const instance = getContractInstance(chain, contractAddress);

    return encodeFunctionData({
        abi: instance.abi,
        functionName: 'redeem',
        args: [
            bondIndexes,
            redemptionCount,
            Boolean(isCapitulation)
        ]
    })
}

const ZcbController = {
    getContractInstance,
    purchase,
    redeem
}

export default ZcbController;
