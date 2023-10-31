import {TransactionMessages, TxTypes, ZCB_ISSUER_CONTRACT} from "@/modules/web3/constants";
import * as ZCB from "@/modules/web3/zcb";
import * as TokensWeb3 from './tokens';
import Web3 from "web3";
import {TransactionReceipt} from "web3-core";

import {sleep} from "@/modules/utils/dates";
import * as Tokens from "./tokens";
import {Chain} from "wagmi";
import {toast} from "react-toastify";
import {ToastPromiseParams} from "react-toastify/dist/core/toast";

function getWeb3Instance(chain: Chain) {
    const RPCs = chain.rpcUrls.public.http;
    const index = Math.floor(Math.random() * RPCs.length)
    return new Web3(RPCs[index]);
}

function getContractInfoByType(chain: Chain | undefined, txType: string, config: any) {
    try {
        if (!chain || !txType) throw "";

        switch (txType) {
            case TxTypes.IssueBond: {
                return {
                    to: ZCB_ISSUER_CONTRACT,
                    data: ZCB.issueBonds(chain, config),
                    value: `0x16345785D8A0000` // 0.1 ETH todo update this
                }
            }
            case TxTypes.ApproveToken: {
                return {
                    to: config.contractAddress,
                    data: TokensWeb3.approve(chain, config.contractAddress, config.spender, config.value)
                }
            }
            case TxTypes.PurchaseBonds: {
                return {
                    to: config.contractAddress,
                    data: ZCB.purchase(chain, config.contractAddress, config.count)
                }
            }
            case TxTypes.RedeemBonds: {
                return {
                    to: config.contractAddress,
                    data: ZCB.redeem(chain, config.contractAddress, config.tokenIds)
                }
            }
            case TxTypes.TransferERC20: {
                return {
                    to: config.contractAddress,
                    data: Tokens.deposit(chain, config.contractAddress, config.toAddress, config.amount)
                }
            }
            case TxTypes.WithdrawRemaining: {
                return {
                    to: config.contractAddress,
                    data: ZCB.withdrawRemaining(chain, config.contractAddress)
                }
            }
            case TxTypes.ChangeOwner: {
                return {
                    to: config.contractAddress,
                    data: ZCB.changeOwner(chain, config.contractAddress, config.newAddress)
                }
            }
            case TxTypes.IssueMoreBonds: {
                return {
                    to: config.contractAddress,
                    data: ZCB.issueMoreBonds(chain, config.contractAddress, config.amount)
                }
            }
            case TxTypes.BurnUnsoldBonds: {
                return {
                    to: config.contractAddress,
                    data: ZCB.burnUnsoldBonds(chain, config.contractAddress, config.amount)
                }
            }
            default: {
                throw Error("Invalid type")
            }
        }
    } catch (error) {
        console.log(`getContractInfoByType`, error)
        return {
            to: "",
            value: 0,
            data: ""
        }
    }
}

async function trackTransaction(chain: Chain | undefined, txHash: string | undefined, messages?: ToastPromiseParams) {
    if (chain && txHash) {
        const txPromise = trackTransactionReceipt(chain, txHash)
        await toast.promise(txPromise, messages || TransactionMessages)
        await Promise.all([txPromise]);
        return txPromise;
    }
}

async function trackTransactionReceipt(chain: Chain, txHash: string, recursionCount = 0): Promise<{ transaction: TransactionReceipt, decoded?: any } | undefined> {
    try {
        // Throw error when 100sec passed
        if (recursionCount > 50) {
            return undefined;
        }
        const web3 = getWeb3Instance(chain);

        await sleep(4000); // info - moved places because the polygon mumbai rpc had issues with confirmed transactions
        const response = await web3.eth.getTransactionReceipt(txHash);
        if (!response) {
            return await trackTransactionReceipt(chain, txHash, recursionCount++);
        }

        if (!response.status) {
            return undefined;
        }

        return decodeTransactionLogs(response);
    } catch (error: any) {
        console.error(`trackTransactionReceipt: ${error.message}`);
        return undefined;
    }
}


async function decodeTransactionLogs(transaction: TransactionReceipt) {

    switch (transaction.to) {
        case ZCB_ISSUER_CONTRACT: {
            const decoded = ZCB.decode(transaction);
            return {
                transaction,
                decoded
            }
        }
        default: {
            return {
                transaction
            }
        }
    }

}

export {
    getWeb3Instance,
    getContractInfoByType,
    trackTransaction,
}
