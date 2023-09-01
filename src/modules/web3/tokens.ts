import {getWeb3Instance} from "@/modules/web3/index";
import ERC20 from './abi-jsons/ERC20.json'
import {TokenInfo} from "@/modules/web3/type";
import {getIcon} from "@/modules/utils/images";

async function getTokenInfo(contractAddress: string, address?: string): Promise<TokenInfo | undefined> {
    try {
        const web3 = getWeb3Instance();

        const contract = new web3.eth.Contract(ERC20 as any, contractAddress);

        const name = await contract.methods.name().call();
        const symbol = await contract.methods.symbol().call();
        const decimals = await contract.methods.decimals().call();

        const result: TokenInfo = {
            name,
            symbol,
            decimals,
            icon: getIcon(contractAddress)
        }

        if (address) {
            result.balance = await getTokenBalance(contractAddress, address);
        }

        return result;
    } catch (error) {
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
    const web3 = getWeb3Instance();
    const contract = new web3.eth.Contract(ERC20 as any, tokenContractAddress);

    return contract.methods.approve(spender, value).encodeABI()
}

export {
    getTokenInfo,
    getAllowance,
    getTokenBalance,
    approve
}