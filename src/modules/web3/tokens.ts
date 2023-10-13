import {getWeb3Instance} from "@/modules/web3/index";
import ERC20 from './abi-jsons/ERC20.json'
import {TokenInfo} from "@/modules/web3/type";
import {getIcon} from "@/modules/utils/images";
import {toBN} from "@/modules/web3/util";
import {DEFAULT_CHAIN_ID} from "@/modules/web3/constants";

function getTokenContract(chainId: string, contractAddress: string) {
    const web3 = getWeb3Instance(chainId);
    return new web3.eth.Contract(ERC20 as any, contractAddress);
}

async function getTokenInfo(contractAddress: string, address?: string): Promise<TokenInfo | undefined> {
    try {
        const contract = getTokenContract(DEFAULT_CHAIN_ID, contractAddress)

        const name = await contract.methods.name().call();
        const symbol = await contract.methods.symbol().call();
        const decimals = await contract.methods.decimals().call();

        const result: TokenInfo = {
            contractAddress: contractAddress,
            name,
            symbol,
            decimals,
            icon: getIcon(contractAddress)
        }

        if (address) {
            const balance = await getTokenBalance(contractAddress, address);
            result.balance = balance;
            result.balanceClean = toBN(balance).div(toBN(10).pow(toBN(decimals))).toString();
        }

        return result;
    } catch (error) {
        console.error(error)
        return;
    }
}

async function getTokenBalance(contractAddress: string, address: string) {
    const contract = getTokenContract(DEFAULT_CHAIN_ID, contractAddress)
    return await contract.methods.balanceOf(address).call();
}

async function getAllowance(contractAddress: string, address: string, spender: string) {
    const contract = getTokenContract(DEFAULT_CHAIN_ID, contractAddress)
    return await contract.methods.allowance(address, spender).call();
}

function approve(tokenContractAddress: string, spender: string, value: number) {
    const contract = getTokenContract(DEFAULT_CHAIN_ID, tokenContractAddress)
    return contract.methods.approve(spender, value).encodeABI()
}

function deposit(contractAddress: string, toAddress: string, value: number) {
    const contract = getTokenContract(DEFAULT_CHAIN_ID, contractAddress)
    return contract.methods.transfer(toAddress, value).encodeABI()
}

export {
    getTokenContract,
    getTokenInfo,
    getAllowance,
    getTokenBalance,
    approve,
    deposit
}