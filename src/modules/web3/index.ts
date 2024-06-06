import {TransactionMessages, TxTypes} from "@/modules/web3/constants";

import {sleep} from "@/modules/utils/dates";
import {Chain} from "wagmi";
import {toast} from "react-toastify";
import {ToastPromiseParams} from "react-toastify/dist/core/toast";
import {ContractInfoType} from "@/modules/web3/type";

import {
    Erc20Controller,
    FixedFlexBondController,
    FixedFlexIssuerController,
    FixedFlexVaultController,
    ProviderController,
} from "amet-utils";

import {TransactionReceipt} from "@ethersproject/abstract-provider";
import BigNumber from "bignumber.js";
import {BondInfoForIssuance} from "@/components/pages/bonds/pages/issue/type";
import {getIssuerContract} from "@/modules/web3/util";
import {ethers} from "ethers";

function getContractInfoByType(chain: Chain | undefined, txType: string, config: any): ContractInfoType {
    try {
        if (!chain || !txType) throw "";

        switch (txType) {
            case TxTypes.IssueBond: {

                const {bondInfo, tokens, issuerContractInfo} = config;
                const {
                    totalBonds,
                    maturityPeriodInBlocks,
                    purchaseToken,
                    purchaseAmount,
                    payoutToken,
                    payoutAmount
                } = bondInfo as BondInfoForIssuance;
                const issuerContract = getIssuerContract(chain.id);

                // for total etc... check uint40
                if (totalBonds > 1099511627775) throw Error("Total Bonds MAX reached")
                if (maturityPeriodInBlocks > 1099511627775) throw Error("Maturity Period MAX reached")

                const purchaseTokenInfo = tokens[purchaseToken]
                const payoutTokenInfo = tokens[payoutToken]

                return {
                    to: issuerContract,
                    data: FixedFlexIssuerController.getIssuerInterface()
                        .encodeFunctionData('issue', [
                            totalBonds,
                            maturityPeriodInBlocks,
                            purchaseToken,
                            "0x" + (BigNumber(purchaseAmount).times(BigNumber(10).pow(BigNumber(purchaseTokenInfo.decimals)))).toString(16),
                            payoutToken,
                            "0x" + (BigNumber(payoutAmount).times(BigNumber(10).pow(BigNumber(payoutTokenInfo.decimals)))).toString(16)
                        ]),
                    value: BigInt(issuerContractInfo.issuanceFee)
                }
            }
            case TxTypes.ApproveToken: {
                const {contractAddress, spender, value} = config
                return {
                    to: contractAddress,
                    data: Erc20Controller.getTokenInterface()
                        .encodeFunctionData("approve", [spender, BigInt(value)])
                }
            }
            case TxTypes.PurchaseBonds: {
                const {contractAddress, count, referrer} = config;
                return {
                    to: contractAddress,
                    data: FixedFlexBondController.getBondInterface()
                        .encodeFunctionData("purchase", [count, (referrer ?? ethers.constants.AddressZero)])
                }
            }
            case TxTypes.RedeemBonds: {
                const {contractAddress, redemptionCount, bondIndexes, isCapitulation} = config;
                return {
                    to: contractAddress,
                    data: FixedFlexBondController.getBondInterface()
                        .encodeFunctionData("redeem", [bondIndexes, redemptionCount, isCapitulation])
                }
            }
            case TxTypes.Settle: {
                const {contractAddress} = config;
                return {
                    to: contractAddress,
                    data: FixedFlexBondController.getBondInterface()
                        .encodeFunctionData("settle")
                }
            }
            case TxTypes.ClaimReferralRewards: {
                const {vaultAddress, contractAddress} = config
                return {
                    to: vaultAddress,
                    data: FixedFlexVaultController.getVaultInterface()
                        .encodeFunctionData("claimReferralRewards", [contractAddress])
                }
            }
            case TxTypes.TransferERC20: {
                const {contractAddress, toAddress, amount} = config;
                return {
                    to: contractAddress,
                    data: Erc20Controller.getTokenInterface()
                        .encodeFunctionData("transfer", [toAddress, BigInt(amount)])
                };
            }
            case TxTypes.WithdrawExcessPayout: {
                const {contractAddress} = config;
                return {
                    to: contractAddress,
                    data: FixedFlexBondController.getBondInterface()
                        .encodeFunctionData('withdrawExcessPayout')
                }
            }
            case TxTypes.UpdateBondSupply: {
                const {contractAddress, count} = config;
                return {
                    to: contractAddress,
                    data: FixedFlexBondController.getBondInterface()
                        .encodeFunctionData('updateBondSupply', [count])
                }
            }
            case TxTypes.DecreaseMaturityPeriod: {
                const {contractAddress, period} = config;
                return {
                    to: contractAddress,
                    data: FixedFlexBondController.getBondInterface()
                        .encodeFunctionData('decreaseMaturityPeriod', [period])
                }
            }
            case TxTypes.ChangeOwner: {
                const {contractAddress, owner} = config;
                return {
                    to: contractAddress,
                    data: FixedFlexBondController.getBondInterface()
                        .encodeFunctionData('transferOwnership', [owner])
                }
            }
            default: {
                throw Error("Invalid type")
            }
        }
    } catch (error: any) {
        // console.log(`getContractInfoByType| ${txType}`, error.message)
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

        const {provider} = new ProviderController(chain.id);

        await sleep(4000); // info - moved places because the polygon mumbai rpc had issues with confirmed transactions
        const response = await provider.getTransactionReceipt(txHash);
        if (!response) {
            return trackTransactionReceipt(chain, txHash, recursionCount++);
        }

        if (!response.status) {
            return undefined;
        }

        return decodeTransactionLogs(chain, response);
    } catch (error: any) {
        console.error(`trackTransactionReceipt: ${error.message}`);
        return trackTransactionReceipt(chain, txHash, recursionCount++);
    }
}


async function decodeTransactionLogs(chain: Chain, transaction: TransactionReceipt) {
    const isFixedFlexIssuer = getIssuerContract(chain.id).toLowerCase() === transaction.to?.toLowerCase();

    switch (true) {
        case isFixedFlexIssuer: {
            const decoded = FixedFlexIssuerController.decode(chain.id, transaction);
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
    getContractInfoByType,
    trackTransaction,
}
