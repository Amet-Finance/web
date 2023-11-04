import {getWeb3Instance} from "@/modules/web3/index";
import ERC20 from './abi-jsons/ERC20.json'
import {TokenInfo} from "@/modules/web3/type";
import {getIcon} from "@/modules/utils/images";
import {toBN} from "@/modules/web3/util";
import {Chain} from "wagmi";

function getTokenContract(chain: Chain, contractAddress: string) {
    const web3 = getWeb3Instance(chain);
    return new web3.eth.Contract(ERC20 as any, contractAddress);
}

async function getTokenInfo(chain: Chain, contractAddress: string, address?: string): Promise<TokenInfo | undefined> {
    try {
        if (!chain) return;
        const contract = getTokenContract(chain, contractAddress)

        const name = await contract.methods.name().call();
        const symbol = await contract.methods.symbol().call();
        const decimals = await contract.methods.decimals().call();

        const result: TokenInfo = {
            contractAddress: contractAddress,
            name,
            symbol,
            decimals,
            icon: getIcon(chain.id, contractAddress)
        }

        if (address) {
            const balance = await getTokenBalance(chain, contractAddress, address);
            result.balance = balance;
            result.balanceClean = toBN(balance).div(toBN(10).pow(toBN(decimals))).toString();
        }

        return result;
    } catch (error) {
        console.error(`getTokenInfo`, error)
        return;
    }
}

async function getTokenBalance(chain: Chain, contractAddress: string, address: string) {
    const contract = getTokenContract(chain, contractAddress)
    return await contract.methods.balanceOf(address).call();
}

async function getAllowance(chain: Chain, contractAddress: string, address: string, spender: string) {
    const contract = getTokenContract(chain, contractAddress)
    return await contract.methods.allowance(address, spender).call();
}

function approve(chain: Chain, contractAddress: string, spender: string, value: number) {
    const contract = getTokenContract(chain, contractAddress)
    return contract.methods.approve(spender, value).encodeABI()
}

function deposit(chain: Chain, contractAddress: string, toAddress: string, value: number) {
    const contract = getTokenContract(chain, contractAddress)
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
