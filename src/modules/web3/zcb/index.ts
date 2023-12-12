import ZCB_Issuer_ABI from '../abi-jsons/ZCB_Issuer.json'
import ZCB_ABI from '../abi-jsons/ZCB_V1.json'
import {getProvider} from "@/modules/web3";

import {BondInfo} from "@/components/pages/bonds/pages/issue/type";
import {getTokenBalance} from "@/modules/web3/tokens";
import {BondInfoDetailed, IssuerContractInfo} from "@/modules/web3/type";
import {Chain} from "wagmi";
import {ZCB_ISSUER_CONTRACTS} from "@/modules/web3/constants";
import {mulBigNumber} from "@/modules/utils/numbers";
import {decodeEventLog, encodeFunctionData, getContract, parseAbiItem, TransactionReceipt} from 'viem'

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

async function getIssuerContractInfo(chain: Chain): Promise<IssuerContractInfo> {
    const contract = getIssuerContractInstance(chain)

    const creationFee = await contract.read.creationFee();
    const creationFeePercentage = await contract.read.creationFeePercentage();
    const isPaused = await contract.read.isPaused();
    const normalizedAmount = Number(creationFee) / 10 ** chain.nativeCurrency.decimals;
    const issuanceFeeForUI = `${normalizedAmount} ${chain.nativeCurrency.symbol}`;

    return {
        issuanceFeeForUI,
        creationFee: Number(creationFee),
        creationFeeHex: `0x${Number(creationFee).toString(16)}`,
        creationFeePercentage: Number(creationFeePercentage),
        isPaused: isPaused === true
    }
}

async function getBondInfo(chain: Chain, contractAddress: string): Promise<BondInfoDetailed> {
    const contract = getContractInstance(chain, contractAddress);
    const info: any = await contract.read.getInfo();

    const [
        issuer, total,
        purchased, redeemed,
        redeemLockPeriod, investmentToken,
        investmentTokenAmount, interestToken,
        interestTokenAmount, feePercentage,
        issuanceDate
    ] = Object.values(info) as any;

    return {
        _id: contractAddress,
        chainId: chain.id,
        issuer: issuer,
        total: Number(total),
        purchased: Number(purchased),
        redeemed: Number(redeemed),
        redeemLockPeriod: Number(redeemLockPeriod),
        investmentToken: investmentToken,
        investmentTokenAmount: investmentTokenAmount.toString(),
        interestToken: interestToken,
        interestTokenAmount: interestTokenAmount.toString(),
        interestTokenBalance: await getTokenBalance(chain, interestToken, contractAddress),
        feePercentage: Number(feePercentage),
        issuanceDate: Number(issuanceDate)
    };
}

async function getBondName(chain: any, contractAddress: string) {
    const contract = getContractInstance(chain, contractAddress);
    return await contract.read.name();
}

async function getTokensPurchaseDates(chain: any, contractAddress: string, tokenIds: number[]): Promise<string[]> {
    const contract = getContractInstance(chain, contractAddress);
    return await contract.read.getTokensPurchaseDates([tokenIds]) as string[];
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

    transaction.logs.forEach((log) => {

        const decoded = decodeEventLog({
            abi: ZCB_Issuer_ABI,
            data: log.data,
            topics: log.topics
        })

        if (decoded.eventName === "Create") {
            result = {
                ...result,
                ...decoded.args
            }
        }
    });

    return result;
}


async function getTransferActivity(chain: Chain, contractAddress: string, fromBlock: bigint, toBlock: bigint) {
    const provider = getProvider(chain)
    return await provider.getLogs({
        address: contractAddress as any,
        event: parseAbiItem('event Transfer(address indexed, address indexed, uint256 indexed)'),
        fromBlock: fromBlock,
        toBlock: toBlock
    })
}


export {
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
    getBondInfo,
    getTokensPurchaseDates,
    getBondName,
    getTransferActivity
}
