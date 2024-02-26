import {Chain} from "wagmi";
import {getProvider} from "@/modules/web3";
import {decodeEventLog, encodeFunctionData, getContract, TransactionReceipt} from "viem";
import {ZCB_ISSUER_CONTRACTS} from "@/modules/web3/constants";
import ISSUER_ABI from "@/modules/web3/fixed-flex/abi-jsons/Issuer.json";
import BigNumber from "bignumber.js";
import {TokensResponse} from "@/modules/cloud-api/type";
import {BondInfoForIssuance} from "@/components/pages/bonds/pages/issue/type";
import {IssuerContractInfoDetailed} from "@/modules/web3/type";
import AmetVaultController from "@/modules/web3/fixed-flex/v2/vault";

function getIssuerContractInstance(chain: Chain) {
    const provider = getProvider(chain)
    return getContract({
        address: ZCB_ISSUER_CONTRACTS[chain.id] as any,
        abi: ISSUER_ABI,
        publicClient: provider
    })
}

function issueBonds(chain: Chain, bondInfo: BondInfoForIssuance, tokens: TokensResponse) {

    // for total etc... check uint40
    if (bondInfo.totalBonds > 1099511627775) throw Error("Total Bonds MAX reached")
    if (bondInfo.maturityPeriodInBlocks > 1099511627775) throw Error("Maturity Period MAX reached")

    const purchaseTokenInfo = tokens[bondInfo.purchaseToken]
    const purchaseAmount = BigNumber(bondInfo.purchaseAmount).times(BigNumber(10).pow(BigNumber(purchaseTokenInfo.decimals)))
    const payoutTokenInfo = tokens[bondInfo.payoutToken]
    const payoutAmount = BigNumber(bondInfo.payoutAmount).times(BigNumber(10).pow(BigNumber(payoutTokenInfo.decimals)))

    const issuerContract = ZcbIssuerController.getIssuerContractInstance(chain)
    return encodeFunctionData({
        abi: issuerContract.abi,
        functionName: 'issue',
        args: [
            bondInfo.totalBonds,
            bondInfo.maturityPeriodInBlocks,
            bondInfo.purchaseToken,
            BigInt(`0x${purchaseAmount.toString(16)}`),
            bondInfo.payoutToken,
            BigInt(`0x${payoutAmount.toString(16)}`)
        ]
    })
}

async function getIssuerContractInfo(chain: Chain): Promise<IssuerContractInfoDetailed> {
    const contract = getIssuerContractInstance(chain)

    const isPaused = await contract.read.isPaused();
    const valutAddress = await contract.read.vault();
    const vaultContract = AmetVaultController.getVaultContractInstance(chain, valutAddress);

    const issuanceFee: any = await vaultContract.read.issuanceFee();
    const initialBondFeeDetails: any = await vaultContract.read.initialBondFeeDetails()
    const normalizedAmount = Number(issuanceFee) / 10 ** chain.nativeCurrency.decimals;

    console.log(initialBondFeeDetails)
    return {
        issuanceFee: Number(issuanceFee),
        issuanceFeeUI: `${normalizedAmount} ${chain.nativeCurrency.symbol}`,
        purchaseRate: Number(initialBondFeeDetails[0]) / 10,
        earlyRedemptionRate: Number(initialBondFeeDetails[1]) / 10,
        referrerRewardRate: Number(initialBondFeeDetails[2]) / 10,
        isPaused: Boolean(isPaused)
    }
}

function decode(transaction: TransactionReceipt): {} {
    let result: { [key: string]: any } = {};

    for (const log of transaction.logs) {
        try {
            const decoded = decodeEventLog({
                abi: ISSUER_ABI,
                data: log.data,
                topics: log.topics
            })

            if (decoded.eventName === "BondIssued") {
                result = {
                    ...result,
                    ...decoded.args
                }
            }
        } catch (e) {
        }
    }

    return result;
}

const ZcbIssuerController = {
    getIssuerContractInstance,
    issueBonds,
    decode,
    getIssuerContractInfo
}
export default ZcbIssuerController
