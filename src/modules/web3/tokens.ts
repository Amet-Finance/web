import {getWeb3Instance} from "@/modules/web3/index";
import {Chain, erc20ABI} from "wagmi";

function getTokenContract(chain: Chain, contractAddress: string) {
    const web3 = getWeb3Instance(chain);
    return new web3.eth.Contract(erc20ABI as any, contractAddress);
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
    getAllowance,
    getTokenBalance,
    approve,
    deposit
}
