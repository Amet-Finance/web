import ZCB_Issuer_ABI from '../abi-jsons/ZCB_Issuer.json'
import ZCB_ABI from '../abi-jsons/ZCB_V1.json'
import {getProvider} from "@/modules/web3";

import {BondInfo} from "@/components/pages/bonds/pages/issue/type";
import { IssuerContractInfoDetailed} from "@/modules/web3/type";
import {Chain} from "wagmi";
import {ZCB_ISSUER_CONTRACTS} from "@/modules/web3/constants";
import {mulBigNumber} from "@/modules/utils/numbers";
import {decodeEventLog, encodeFunctionData, getContract, parseAbi, TransactionReceipt} from 'viem'
import AmetVaultController from "@/modules/web3/zcb/v2/vault";

function getContractInstance(chain: Chain, contractAddress: string) {
    const provider = getProvider(chain)
    return getContract({
        address: contractAddress as any,
        abi: ZCB_ABI,
        publicClient: provider
    })
}

function getIssuerContractInstance(chain: Chain) {
    const provider = getProvider(chain)
    return getContract({
        address: ZCB_ISSUER_CONTRACTS[chain.id] as any,
        abi: ZCB_Issuer_ABI,
        publicClient: provider
    })
}

async function getIssuerContractInfo(chain: Chain): Promise<IssuerContractInfoDetailed> {
    const contract = getIssuerContractInstance(chain)

    const valutAddress = await contract.read.vault();
    const vaultContract = AmetVaultController.getVaultContractInstance(chain, valutAddress);

    const issuanceFee: any = await vaultContract.read.issuanceFee();

    const contractPackedInfo: any = await contract.read.contractPackedInfo();
    const normalizedAmount = Number(issuanceFee) / 10 ** chain.nativeCurrency.decimals;

    return {
        issuanceFee: Number(issuanceFee),
        issuanceFeeUI: `${normalizedAmount} ${chain.nativeCurrency.symbol}`,
        purchaseFeePercentage: Number(contractPackedInfo[0]) / 10,
        earlyRedemptionFeePercentage: Number(contractPackedInfo[1]) / 10,
        isPaused: contractPackedInfo[2],
    }
}

function issueBonds(chain: Chain, bondInfo: BondInfo) {
    const {
        total,
        redeemLockPeriod,
        investmentToken,
        interestTokenAmount,
        interestToken,
        investmentTokenAmount,
        investmentTokenInfo,
        interestTokenInfo
    } = bondInfo;

    const isInvestInvalid = !investmentTokenInfo || !Object.keys(investmentTokenInfo) || typeof investmentTokenInfo.decimals === "undefined"
    const isInterestInvalid = !interestTokenInfo || !Object.keys(interestTokenInfo) || typeof interestTokenInfo.decimals === "undefined"
    if (isInvestInvalid || isInterestInvalid) {
        throw Error("Investment or Interest Token info is undefined")
    }


    const investmentAmount = mulBigNumber(investmentTokenAmount, investmentTokenInfo.decimals, true)
    const interestAmount = mulBigNumber(interestTokenAmount, interestTokenInfo.decimals, true)

    const contract = getIssuerContractInstance(chain);

    return encodeFunctionData({
        abi: contract.abi,
        functionName: 'create',
        args: [
            total,
            redeemLockPeriod,
            investmentToken,
            BigInt(investmentAmount.toNumber()),
            interestToken,
            BigInt(interestAmount.toNumber()),
            `Amet Finance | ${investmentTokenInfo?.symbol.toUpperCase()}-${interestTokenInfo?.symbol.toUpperCase()}-ZCB`
        ] as any
    })
}

function purchase(chain: Chain, contractAddress: string, count: number) {
    const contract = getContractInstance(chain, contractAddress);
    return encodeFunctionData({
        abi: contract.abi,
        functionName: 'purchase',
        args: [count] as any
    })
}

function redeem(chain: Chain, contractAddress: string, tokenIds: string[]) {
    const contract = getContractInstance(chain, contractAddress)
    return encodeFunctionData({
        abi: contract.abi,
        functionName: 'redeem',
        args: [tokenIds] as any
    })
}

function withdrawRemaining(chain: Chain, contractAddress: string) {
    const contract = getContractInstance(chain, contractAddress)
    return encodeFunctionData({
        abi: contract.abi,
        functionName: 'withdrawRemaining',
        args: []
    })
}

function changeOwner(chain: Chain, contractAddress: string, newAddress: string) {
    const contract = getContractInstance(chain, contractAddress);
    return encodeFunctionData({
        abi: contract.abi,
        functionName: 'changeOwner',
        args: [newAddress] as any
    })
}

function issueMoreBonds(chain: Chain, contractAddress: string, amount: number) {
    const contract = getContractInstance(chain, contractAddress);
    return encodeFunctionData({
        abi: contract.abi,
        functionName: 'issueBonds',
        args: [amount] as any
    })
}

function burnUnsoldBonds(chain: Chain, contractAddress: string, amount: number) {
    const contract = getContractInstance(chain, contractAddress);
    return encodeFunctionData({
        abi: contract.abi,
        functionName: 'burnUnsoldBonds',
        args: [amount] as any
    })
}

function decreaseRedeemLockPeriod(chain: Chain, contractAddress: string, newPeriod: number) {
    const contract = getContractInstance(chain, contractAddress)
    return encodeFunctionData({
        abi: contract.abi,
        functionName: 'decreaseRedeemLockPeriod',
        args: [newPeriod] as any
    })
}

function decode(transaction: TransactionReceipt): {} {
    let result: { [key: string]: any } = {};

    for (const log of transaction.logs) {
        try {
            const decoded = decodeEventLog({
                abi: ZCB_Issuer_ABI,
                data: log.data,
                topics: log.topics
            })

            if (decoded.eventName === "Issue") {
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


async function getTransferActivity(chain: Chain, contractAddress: string, fromBlock: bigint, toBlock: bigint) {
    const provider = getProvider(chain)

    return await provider.getLogs({
        address: contractAddress as any,
        events: parseAbi([
            'event TransferBatch(address indexed, address indexed, address indexed, uint256[], uint256[])',
            'event TransferSingle(address indexed, address indexed, address indexed, uint256, uint256)'
        ]),
        fromBlock: fromBlock,
        toBlock: toBlock
    })
}


export {
    getIssuerContractInstance,
    getIssuerContractInfo,
    issueBonds,
    purchase,
    redeem,
    changeOwner,
    withdrawRemaining,
    burnUnsoldBonds,
    decreaseRedeemLockPeriod,
    issueMoreBonds,
    decode,
    getTransferActivity
}
