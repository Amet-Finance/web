import {Chain} from "wagmi";
import {getProvider} from "@/modules/web3";
import {encodeFunctionData, getContract, isAddress, parseAbi} from "viem";
import FIXED_FLEX_BOND_ABI from "@/modules/web3/fixed-flex/v2/abi-jsons/Bond.json";
import {ZERO_ADDRESS} from "@/modules/web3/constants";
import {ActionLogFormat} from "@/components/pages/bonds/pages/explore-bond-id/type";
import {LogTypes} from "@/modules/web3/fixed-flex/v2/constants";

function getContractInstance(chain: Chain, contractAddress: string) {
    const provider = getProvider(chain)
    return getContract({
        address: contractAddress as any,
        abi: FIXED_FLEX_BOND_ABI,
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

function settle(chain: Chain, contractAddress: string) {
    const instance = getContractInstance(chain, contractAddress);

    return encodeFunctionData({
        abi: instance.abi,
        functionName: 'settle',
        args: []
    })
}

function withdrawExcessPayout(chain: Chain, contractAddress: string) {
    const instance = getContractInstance(chain, contractAddress);

    return encodeFunctionData({
        abi: instance.abi,
        functionName: 'withdrawExcessPayout',
        args: []
    })
}

async function getTransferActivity(chain: Chain, contractAddress: string, fromBlock: bigint, toBlock: bigint): Promise<ActionLogFormat[]> {

    const provider = getProvider(chain)
    const logs = await provider.getLogs({
        address: contractAddress as any,
        events: parseAbi([
            'event TransferBatch(address indexed, address indexed, address indexed, uint256[], uint256[])',
            'event TransferSingle(address indexed, address indexed, address indexed, uint256, uint256)'
        ]),
        fromBlock: fromBlock,
        toBlock: toBlock
    })

    return logs.map(log => {
        const operator = log.args[0]
        const from = log.args[1] || ""
        const to = log.args[2] || ""
        const ids = log.args[3] || []
        const counts = log.args[4] || []

        const totalCount = Array.isArray(counts) ? counts.reduce((acc: bigint, item: bigint) => acc += item, BigInt(0)) : counts

        let type = LogTypes.Transfer;
        if (from.toLowerCase() === ZERO_ADDRESS.toLowerCase()) {
            type = LogTypes.Purchase
        } else if (to.toLowerCase() === ZERO_ADDRESS.toLowerCase()) {
            type = LogTypes.Redeem
        }

        return {
            from: from || "",
            to: to || "",
            block: Number(log.blockNumber),
            hash: log.transactionHash,
            type: type,
            count: Number(totalCount)
        } as ActionLogFormat
    })
}

const FixedFlexController = {
    getContractInstance,
    purchase,
    redeem,
    settle,
    withdrawExcessPayout,
    getTransferActivity
}

export default FixedFlexController;
