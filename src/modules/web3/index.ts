import {DEFAULT_CHAIN_ID, RPC_BY_CHAINS, TxTypes, WalletTypes} from "@/modules/web3/constants";
import * as Metamask from './metamask/index'
import * as ZCB from "@/modules/web3/zcb";
import * as TokensWeb3 from './tokens';
import Web3 from "web3";
import {TransactionConfig, TransactionReceipt} from "web3-core";
import {ZCB_ISSUER_CONTRACT} from "@/modules/web3/zcb/constants";
import {sleep} from "@/modules/utils/dates";
import {toast} from "react-toastify";
import * as AccountSlice from "@/store/redux/account";
import * as Tokens from "./tokens";

function getWeb3Instance(chainId: string) {

    const RPCs = RPC_BY_CHAINS[chainId];
    const index = Math.floor(Math.random() * RPCs.length)
    return new Web3(RPCs[index]);
}

async function connectWallet(type: string, callback?: any) {
    let address = getWalletAddress();

    switch (type) {
        case WalletTypes.Metamask: {
            address = await Metamask.connectWallet()
        }
    }

    if (!address) {
        toast.error(`Could not connect ${type} wallet`)
        return;
    }

    if (callback) {
        callback();
    }
    await AccountSlice.initWallet(address);
    return address;
}

function getWalletAddress(): string | undefined {
    return Metamask.getWalletAddress();
}

async function submitTransaction(type: string, txType: string, config: any) {

    const address = await connectWallet(WalletTypes.Metamask)
    const contractInfo = getContractInfoByType(txType, config);

    const transactionConfig: TransactionConfig = {
        from: address,
        to: contractInfo.to,
        data: contractInfo.data,
        value: contractInfo.value || 0
    }

    switch (type) {
        case WalletTypes.Metamask: {
            const txHash = await Metamask.submitTransaction(transactionConfig);
            if (txHash) {
                const transaction = trackTransaction(txHash)
                await toast.promise(transaction, {
                    pending: "Transaction was submitted",
                    error: "Transaction failed",
                    success: "Transaction succeeded"
                }, {
                    draggable: true
                });
                return transaction.then(tx => tx);
            }
        }
    }
}

function getContractInfoByType(txType: string, config: any) {
    switch (txType) {
        case TxTypes.IssueBond: {
            return {
                to: ZCB_ISSUER_CONTRACT,
                data: ZCB.issueBonds(config),
                value: `0x16345785D8A0000`
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
        case TxTypes.RedeemBonds: {
            return {
                to: config.contractAddress,
                data: ZCB.redeem(config.contractAddress, config.ids)
            }
        }
        case TxTypes.TransferERC20: {
            return {
                to: config.contractAddress,
                data: Tokens.deposit(config.contractAddress, config.toAddress, config.amount)
            }
        }
        case TxTypes.WithdrawRemaining: {
            return {
                to: config.contractAddress,
                data: ZCB.withdrawRemaining(config.contractAddress)
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
        const web3 = getWeb3Instance(DEFAULT_CHAIN_ID);

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