import {DEFAULT_CHAIN_ID, RPC_BY_CHAINS, TxTypes, WalletTypes} from "@/modules/web3/constants";
import * as Metamask from './metamask/index'
import * as ZCB from "@/modules/web3/zcb";
import * as TokensWeb3 from './tokens';
import Web3 from "web3";
import {TransactionConfig, TransactionReceipt} from "web3-core";
import {ZCB_ISSUER_CONTRACT} from "@/modules/web3/zcb/constants";
import {sleep} from "@/modules/utils/dates";

function getWeb3Instance() {
    const rpcs = RPC_BY_CHAINS[DEFAULT_CHAIN_ID];
    const index = Math.floor(Math.random() * rpcs.length)

    return new Web3(rpcs[index]);
}

async function connectWallet(type: string) {
    let address;

    switch (type) {
        case WalletTypes.Metamask: {
            address = await Metamask.connectWallet()
        }
    }

    if (!address) {
        alert("Could not Connect")
    }

    return address;
}

function getWalletAddress(): string | undefined {
    return Metamask.getWalletAddress();
}

async function submitTransaction(type: string, txType: string, config: any) {

    console.log(`config`, config)
    const address = await connectWallet(WalletTypes.Metamask)
    const contractInfo = getContractInfoByType(txType, config);

    const transactionConfig: TransactionConfig = {
        from: address,
        to: contractInfo.to,
        data: contractInfo.data
    }
    switch (type) {
        case WalletTypes.Metamask: {
            const txHash = await Metamask.submitTransaction(transactionConfig);
            const transaction = await trackTransaction(txHash);
            return transaction;
        }
    }
}

function getContractInfoByType(txType: string, config: any) {
    switch (txType) {
        case TxTypes.IssueBond: {
            return {
                to: ZCB_ISSUER_CONTRACT,
                data: ZCB.issueBonds(config)
            }
        }
        case TxTypes.ApproveToken: {
            return {
                to: config.contractAddress,
                data: TokensWeb3.approve(config.contractAddress, config.spender, config.value)
            }
        }
        case TxTypes.PurchaseBonds: {
            return {
                to: config.contractAddress,
                data: ZCB.purchase(config.contractAddress, config.count)
            }
        }
        default: {
            throw Error("Invalid type")
        }
    }
}

async function trackTransaction(txHash: string, recursionCount = 0): Promise<any | undefined> {
    try {
        if (recursionCount > 50) {
            // Throw error when 100sec passed
            return undefined;
        }
        const web3 = getWeb3Instance();

        await sleep(4000); // info - moved places because the polygon mumbai rpc had issues with confirmed transactions
        const response = await web3.eth.getTransactionReceipt(txHash);
        if (!response) {
            return await trackTransaction(txHash, recursionCount++);
        }

        if (!response.status) {
            return undefined;
        }

        return decodeTransactionLogs(response);
    } catch (error: any) {
        console.error(`trackTransaction: ${error.message}`);
        return undefined;
    }
}

async function decodeTransactionLogs(transaction: TransactionReceipt) {

    switch (transaction.to) {
        case ZCB_ISSUER_CONTRACT: {
            const decoded = ZCB.decode(transaction);
            return {
                ...transaction,
                decoded
            }
        }
        default: {
            return transaction
        }
    }

}

export {
    getWeb3Instance,
    connectWallet,
    getWalletAddress,
    submitTransaction
}