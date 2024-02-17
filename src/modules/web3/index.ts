import {TransactionMessages, TxTypes, ZCB_ISSUER_CONTRACTS} from "@/modules/web3/constants";
import * as ZCB from "@/modules/web3/zcb";
import * as TokensWeb3 from './tokens';
import * as Tokens from './tokens';

import {sleep} from "@/modules/utils/dates";
import {Chain} from "wagmi";
import {toast} from "react-toastify";
import {ToastPromiseParams} from "react-toastify/dist/core/toast";
import {createPublicClient, http, TransactionReceipt} from "viem";
import {ContractInfoType} from "@/modules/web3/type";
import ZcbIssuerController from "@/modules/web3/zcb/v2/issuer";
import ZcbController from "@/modules/web3/zcb/v2";

function getProvider(chain: Chain) {
    return createPublicClient({
        chain: chain,
        transport: http()
    });
}

function getContractInfoByType(chain: Chain | undefined, txType: string, config: any): ContractInfoType {
    try {
        if (!chain || !txType) throw "";

        switch (txType) {
            case TxTypes.IssueBond: {
                return {
                    to: ZCB_ISSUER_CONTRACTS[chain.id],
                    data: ZcbIssuerController.issueBonds(chain, config.bondInfo, config.tokens),
                    value: BigInt(config.issuerContractInfo.issuanceFee)
                }
            }
            case TxTypes.ApproveToken: {
                return {
                    to: config.contractAddress,
                    data: TokensWeb3.approve(chain, config.contractAddress, config.spender, BigInt(config.value))
                }
            }
            case TxTypes.PurchaseBonds: {
                return {
                    to: config.contractAddress,
                    data: ZcbController.purchase(chain, config.contractAddress, config.count, config.referrer)
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
                    data: Tokens.deposit(chain, config.contractAddress, config.toAddress, BigInt(config.amount))
                };
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
            case TxTypes.DecreaseRedeemLockPeriod: {
                return {
                    to: config.contractAddress,
                    data: ZCB.decreaseRedeemLockPeriod(chain, config.contractAddress, config.newPeriod)
                }
            }
            default: {
                throw Error("Invalid type")
            }
        }
    } catch (error: any) {
        console.log(`getContractInfoByType| ${txType}`, error.message)
        return {
            to: "",
            value: BigInt(0),
            data: "0x"
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

async function trackTransactionReceipt(chain: Chain, txHash: string, recursionCount = 0): Promise<{
    transaction: TransactionReceipt,
    decoded?: any
} | undefined> {
    try {
        // Throw error when 100sec passed
        if (recursionCount > 50) {
            return undefined;
        }
        const provider = getProvider(chain);

        await sleep(4000); // info - moved places because the polygon mumbai rpc had issues with confirmed transactions
        const response = await provider.getTransactionReceipt({hash: txHash as any});
        if (!response) {
            return trackTransactionReceipt(chain, txHash, recursionCount++);
        }

        if (!response.status) {
            return undefined;
        }

        return decodeTransactionLogs(response);
    } catch (error: any) {
        console.error(`trackTransactionReceipt: ${error.message}`);
        return trackTransactionReceipt(chain, txHash, recursionCount++);
    }
}


async function decodeTransactionLogs(transaction: TransactionReceipt) {

    const isZcbIssuer = Object.values(ZCB_ISSUER_CONTRACTS).some(address => address.toLowerCase() === transaction.to?.toLowerCase())

    switch (true) {
        case isZcbIssuer: {
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
    getProvider,
    getContractInfoByType,
    trackTransaction,
}
