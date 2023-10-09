import {getWeb3Instance} from "@/modules/web3/index";
import ERC20 from './abi-jsons/ERC20.json'
import {TokenInfo} from "@/modules/web3/type";
import {getIcon} from "@/modules/utils/images";

function getTokenContract(address: string) {
    const web3 = getWeb3Instance();
    return new web3.eth.Contract(ERC20 as any, address);
}

async function getTokenInfo(contractAddress: string, address?: string): Promise<TokenInfo | undefined> {
    try {
        const web3 = getWeb3Instance();
        const {toBN} = web3.utils;

        const contract = new web3.eth.Contract(ERC20 as any, contractAddress);

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
    const web3 = getWeb3Instance();

    const contract = new web3.eth.Contract(ERC20 as any, contractAddress);
    return await contract.methods.balanceOf(address).call();
}

async function getAllowance(tokenContractAddress?: string, address?: string, spender?: string) {
    if (!tokenContractAddress || !address || !spender) {
        return 0;
    }

    const web3 = getWeb3Instance();
    const contract = new web3.eth.Contract(ERC20 as any, tokenContractAddress);

    return await contract.methods.allowance(address, spender).call();
}

function approve(tokenContractAddress: string, spender: string, value: number) {
    const contract = getTokenContract(tokenContractAddress)
    return contract.methods.approve(spender, value).encodeABI()
}

function deposit(tokenContractAddress: string, toAddress: string, value: number) {
    const contract = getTokenContract(tokenContractAddress)
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