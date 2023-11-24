import {getProvider} from "@/modules/web3/index";
import {Chain, erc20ABI} from "wagmi";
import {encodeFunctionData, getContract} from "viem";

function getTokenContract(chain: Chain, contractAddress: string) {
    const provider = getProvider(chain);
    return getContract({
        address: contractAddress as any,
        abi: erc20ABI,
        publicClient: provider
    })
}

async function getTokenBalance(chain: Chain, contractAddress: string, address: string): Promise<string> {
    const contract = getTokenContract(chain, contractAddress);
    const balance = await contract.read.balanceOf([address] as any);
    return balance.toString();
}

async function getAllowance(chain: Chain, contractAddress: string, address: string, spender: string) {
    const contract = getTokenContract(chain, contractAddress)
    return await contract.read.allowance([address, spender] as any);
}

function approve(chain: Chain, contractAddress: string, spender: string, value: bigint) {
    const contract = getTokenContract(chain, contractAddress)
    return encodeFunctionData({
        abi: contract.abi,
        functionName: 'approve',
        args: [spender, value] as any
    })
}

function deposit(chain: Chain, contractAddress: string, toAddress: string, value: bigint) {
    const contract = getTokenContract(chain, contractAddress)
    return encodeFunctionData({
        abi: contract.abi,
        functionName: 'transfer',
        args: [toAddress, value] as any
    });
}

export {
    getTokenContract,
    getAllowance,
    getTokenBalance,
    approve,
    deposit
}
