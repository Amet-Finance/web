import {FIXED_FLEX_ISSUER_CONTRACTS, TransactionMessages, TxTypes} from "@/modules/web3/constants";
import * as TokensWeb3 from './tokens';

import {sleep} from "@/modules/utils/dates";
import {Chain} from "wagmi";
import {toast} from "react-toastify";
import {ToastPromiseParams} from "react-toastify/dist/core/toast";
import {createPublicClient, http, TransactionReceipt} from "viem";
import {ContractInfoType} from "@/modules/web3/type";
import FixedFlexIssuerController from "@/modules/web3/fixed-flex/v2/issuer";
import FixedFlexController from "@/modules/web3/fixed-flex/v2";
import FixedFlexVaultController from "@/modules/web3/fixed-flex/v2/vault";
import TokenController from "./tokens";

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
                    to: FIXED_FLEX_ISSUER_CONTRACTS[chain.id],
                    data: FixedFlexIssuerController.issueBonds(chain, config.bondInfo, config.tokens),
                    value: BigInt(config.issuerContractInfo.issuanceFee)
                }
            }
            case TxTypes.ApproveToken: {
                return {
                    to: config.contractAddress,
                    data: TokenController.approve(chain, config.contractAddress, config.spender, BigInt(config.value))
                }
            }
            case TxTypes.PurchaseBonds: {
                return {
                    to: config.contractAddress,
                    data: FixedFlexController.purchase(chain, config.contractAddress, config.count, config.referrer)
                }
            }
            case TxTypes.RedeemBonds: {
                return {
                    to: config.contractAddress,
                    data: FixedFlexController.redeem(chain, config.contractAddress, config.bondIndexes, config.redemptionCount, config.isCapitulation)
                }
            }
            case TxTypes.Settle: {
                return {
                    to: config.contractAddress,
                    data: FixedFlexController.settle(chain, config.contractAddress)
                }
            }
            case TxTypes.ClaimReferralRewards: {
                return {
                    to: config.vaultAddress,
                    data: FixedFlexVaultController.claimReferralRewards(chain, config.vaultAddress, config.contractAddress)
                }
            }
            case TxTypes.TransferERC20: {
                return {
                    to: config.contractAddress,
                    data: TokenController.deposit(chain, config.contractAddress, config.toAddress, BigInt(config.amount))
                };
            }

            case TxTypes.WithdrawExcessPayout: {
                return {
                    to: config.contractAddress,
                    data: FixedFlexController.withdrawExcessPayout(chain, config.contractAddress)
                }
            }
            case TxTypes.UpdateBondSupply: {
                return {
                    to: config.contractAddress,
                    data: FixedFlexController.updateBondSupply(chain, config.contractAddress, config.count)
                }
            }
            case TxTypes.DecreaseMaturityPeriod: {
                return {
                    to: config.contractAddress,
                    data: FixedFlexController.decreaseMaturityPeriod(chain, config.contractAddress, config.period)
                }
            }
            case TxTypes.ChangeOwner: {
                return {
                    to: config.contractAddress,
                    data: FixedFlexController.transferOwnership(chain, config.contractAddress, config.owner)
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

    const isFixedFlexIssuer = Object
        .values(FIXED_FLEX_ISSUER_CONTRACTS)
        .some(address => address.toLowerCase() === transaction.to?.toLowerCase())

    switch (true) {
        case isFixedFlexIssuer: {
            const decoded = FixedFlexIssuerController.decode(transaction);
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
