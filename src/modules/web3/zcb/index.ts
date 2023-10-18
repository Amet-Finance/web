import ZCB_Issuer_ABI from '../abi-jsons/ZCB_Issuer.json'
import ZCB_ABI from '../abi-jsons/ZCB_V1.json'
import {getWeb3Instance} from "@/modules/web3";
import {ZCB_ISSUER_CONTRACT} from "@/modules/web3/zcb/constants";
import {BondInfo} from "@/components/pages/bonds/pages/issue/type";
import {TransactionReceipt} from "web3-core";
import {getTokenBalance} from "@/modules/web3/tokens";
import {BondInfoDetailed} from "@/modules/web3/type";
import {toBN} from "@/modules/web3/util";
import {CHAIN_IDS} from "@/modules/web3/constants";

function getContract(chainId: string, contractAddress: string) {
    const web3 = getWeb3Instance(chainId)
    return new web3.eth.Contract(ZCB_ABI as any, contractAddress);
}

async function getBondInfo(chainId: string, contractAddress: string): Promise<BondInfoDetailed> {
    const contract = getContract(chainId, contractAddress);
    const info = await contract.methods.getInfo().call();

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
        chainId,
        issuer,
        total,
        purchased,
        redeemed,
        redeemLockPeriod,
        investmentToken,
        investmentTokenAmount,
        interestToken,
        interestTokenAmount,
        interestTokenBalance: await getTokenBalance(chainId, interestToken, contractAddress),
        feePercentage,
        issuanceDate
    };
}

async function getTokensPurchaseDates(chainId: string, contractAddress: string, tokenIds: number[]) {
    const contract = getContract(chainId, contractAddress);
    return await contract.methods.getTokensPurchaseDates(tokenIds).call();
}

function issueBonds(chainId: string, bondInfo: BondInfo): string | undefined {
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

    const isInvestInvalid = !investmentTokenInfo || typeof investmentTokenInfo.decimals === "undefined"
    const isInterestInvalid = !interestTokenInfo || typeof interestTokenInfo.decimals === "undefined"
    if (isInvestInvalid || isInterestInvalid) {
        throw Error("Investment or Interest Token info is undefined")
    }


    const investmentAmount = toBN(Number(investmentTokenAmount)).mul(toBN(10).pow(toBN(Number(investmentTokenInfo.decimals))));
    const interestAmount = toBN(Number(interestTokenAmount)).mul(toBN(10).pow(toBN(Number(interestTokenInfo.decimals))));

    const web3 = getWeb3Instance(chainId)
    const contract = new web3.eth.Contract(ZCB_Issuer_ABI as any, ZCB_ISSUER_CONTRACT);
    return contract.methods.create(
        total,
        redeemLockPeriod,
        investmentToken,
        investmentAmount,
        interestToken,
        interestAmount,
        `${investmentTokenInfo?.symbol}-${interestTokenInfo?.symbol} | Amet Finance`
    ).encodeABI();
}

function purchase(chainId: string, contractAddress: string, count: number) {
    const contract = getContract(chainId, contractAddress)
    return contract.methods.purchase(count).encodeABI();
}

function redeem(chainId: string, contractAddress: string, ids: string[]) {
    const contract = getContract(chainId, contractAddress)
    return contract.methods.redeem(ids).encodeABI();
}

function withdrawRemaining(chainId: string, contractAddress: string) {
    const contract = getContract(chainId, contractAddress)
    return contract.methods.withdrawRemaining().encodeABI();
}

function decode(transaction: TransactionReceipt): {} {

    const web3 = getWeb3Instance(CHAIN_IDS.Mumbai); // todo here it is hardcoded
    const eventAbi: any = ZCB_Issuer_ABI.find((abi) => abi.name === "Create");
    const eventSignature = web3.eth.abi.encodeEventSignature(eventAbi);

    const result: { [key: string]: any } = {};

    transaction.logs.forEach((log, index) => {
        if (log.topics[0] === eventSignature) {
            const decodedData = web3.eth.abi.decodeLog(
                eventAbi.inputs,
                log.data,
                log.topics.slice(1)
            );
            Object.keys(decodedData).forEach((key: string) => {
                result[key] = decodedData[key];
            })
        }
    });

    return result;
}

export {
    issueBonds,
    purchase,
    redeem,
    withdrawRemaining,
    decode,
    getBondInfo,
    getTokensPurchaseDates
}