import ZCB_Issuer_ABI from '../abi-jsons/ZCB_Issuer.json'
import ZCB_ABI from '../abi-jsons/ZCB_V1.json'
import {getWeb3Instance} from "@/modules/web3";
import {ZCB_ISSUER_CONTRACT} from "@/modules/web3/zcb/constants";
import {BondInfo} from "@/components/pages/bonds/pages/issue/type";
import {TransactionReceipt} from "web3-core";
import {getTokenBalance} from "@/modules/web3/tokens";
import {BondInfoDetailed} from "@/modules/web3/type";
import {toBN} from "@/modules/web3/util";
import {DEFAULT_CHAIN_ID} from "@/modules/web3/constants";

function getContract(contractAddress: string) {
    const web3 = getWeb3Instance(DEFAULT_CHAIN_ID)
    return new web3.eth.Contract(ZCB_ABI as any, contractAddress);
}

async function getInfo(contractAddress: string): Promise<BondInfoDetailed> {
    const contract = getContract(contractAddress);
    const info = await contract.methods.getInfo().call();
    return {
        _id: contractAddress,
        issuer: info[0],
        total: info[1],
        purchased: info[2],
        redeemed: info[3],
        redeemLockPeriod: info[4],
        investmentToken: info[5],
        investmentTokenAmount: info[6],
        interestToken: info[7],
        interestTokenAmount: info[8],
        interestTokenBalance: await getTokenBalance(info[5], contractAddress),
        feePercentage: Number(info[9]),
        issuanceDate: Number(info[10])
    };
}

async function getTokensPurchaseDates(contractAddress: string, tokenIds: number[]) {
    const contract = getContract(contractAddress);
    return await contract.methods.getTokensPurchaseDates(tokenIds).call();
}

function issueBonds(bondInfo: BondInfo): string | undefined {

    try {
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

        const web3 = getWeb3Instance(DEFAULT_CHAIN_ID)
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
    } catch (error: any) {
        console.log(`error`, error)
    }

}

function purchase(contractAddress: string, count: number) {
    try {
        const contract = getContract(contractAddress)
        return contract.methods.purchase(count).encodeABI();
    } catch (error: any) {
        console.log(`error`, error)
    }
}

function redeem(contractAddress: string, ids: string[]) {
    try {
        const contract = getContract(contractAddress)
        return contract.methods.redeem(ids).encodeABI();
    } catch (error: any) {
        console.log(`error`, error)
    }
}

function withdrawRemaining(contractAddress: string) {
    try {
        const contract = getContract(contractAddress)
        return contract.methods.withdrawRemaining().encodeABI();
    } catch (error: any) {
        console.log(`error`, error)
    }
}

function decode(transaction: TransactionReceipt): {} {

    const web3 = getWeb3Instance(DEFAULT_CHAIN_ID);
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
    getInfo,
    getTokensPurchaseDates
}