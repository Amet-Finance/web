import {RPC_BY_CHAINS, TxTypes, WalletTypes} from "@/modules/web3/constants";
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
import {ConnectWallet, SubmitTransaction, TransactionTracking} from "@/modules/web3/type";
import {closeModal} from "@/store/redux/modal";

function getWeb3Instance(chainId: string) {

    const RPCs = RPC_BY_CHAINS[chainId];
    const index = Math.floor(Math.random() * RPCs.length)
    return new Web3(RPCs[index]);
}

async function connectWallet(connectionConfig: ConnectWallet): Promise<string | undefined> {
    const {type, requestAccounts, hideError, callback} = connectionConfig;
    try {

        let address;
        let chainId;

        switch (type) {
            case WalletTypes.Metamask: {
                const result = await Metamask.connectWalletAndSwitchChain(connectionConfig)
                address = result.address;
                chainId = result.chainId;
            }
        }

        if (!address) {
            if (requestAccounts) {
                toast.error(`Could not connect ${type} wallet`)
            }
            return;
        }

        if (callback) { // todo later can be deleted
            callback();
        }

        closeModal()
        await AccountSlice.initiateWallet(address, chainId);
        return address;
    } catch (error: any) {
        if (!hideError) {
            throw Error(error)
        }
    }
}

async function submitTransaction(submitTransaction: SubmitTransaction) {
    const {connectionConfig, txType, config} = submitTransaction
    try {
        const address = await connectWallet({
            ...connectionConfig,
            requestAccounts: true,
            requestChain: true
        })

        const contractInfo = getContractInfoByType({connectionConfig, txType, config});

        const transaction: TransactionConfig = {
            from: address,
            to: contractInfo.to,
            data: contractInfo.data,
            value: contractInfo.value || 0
        }

        switch (connectionConfig.type) {
            case WalletTypes.Metamask: {
                const txHash = await Metamask.submitTransaction(transaction);
                if (txHash) {
                    const transaction = trackTransaction({
                        connectionConfig,
                        txHash,
                        txType,
                        recursionCount: 0
                    })
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
    } catch (error: Error | any) {
        toast.error(`Transaction submission failed: ${error.message}`)
    }
}

function getContractInfoByType(submitTransaction: SubmitTransaction) {
    const {connectionConfig, txType, config} = submitTransaction;
    const {chainId} = connectionConfig;

    switch (txType) {
        case TxTypes.IssueBond: {
            return {
                to: ZCB_ISSUER_CONTRACT,
                data: ZCB.issueBonds(chainId, config),
                value: `0x16345785D8A0000` // 0.1 ETH todo update this
            }
        }
        case TxTypes.ApproveToken: {
            return {
                to: config.contractAddress,
                data: TokensWeb3.approve(chainId, config.contractAddress, config.spender, config.value)
            }
        }
        case TxTypes.PurchaseBonds: {
            return {
                to: config.contractAddress,
                data: ZCB.purchase(chainId, config.contractAddress, config.count)
            }
        }
        case TxTypes.RedeemBonds: {
            return {
                to: config.contractAddress,
                data: ZCB.redeem(chainId, config.contractAddress, config.ids)
            }
        }
        case TxTypes.TransferERC20: {
            return {
                to: config.contractAddress,
                data: Tokens.deposit(chainId, config.contractAddress, config.toAddress, config.amount)
            }
        }
        case TxTypes.WithdrawRemaining: {
            return {
                to: config.contractAddress,
                data: ZCB.withdrawRemaining(chainId, config.contractAddress)
            }
        }
        default: {
            throw Error("Invalid type")
        }
    }
}

async function trackTransaction(trackingConfig: TransactionTracking): Promise<any | undefined> {
    const {connectionConfig, txType, txHash, recursionCount} = trackingConfig;
    const {chainId} = connectionConfig;

    try {
        if (recursionCount > 50) {
            // Throw error when 100sec passed
            return undefined;
        }
        const web3 = getWeb3Instance(chainId);

        await sleep(4000); // info - moved places because the polygon mumbai rpc had issues with confirmed transactions
        const response = await web3.eth.getTransactionReceipt(txHash);
        if (!response) {
            trackingConfig.recursionCount++
            return await trackTransaction(trackingConfig);
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
    submitTransaction
}