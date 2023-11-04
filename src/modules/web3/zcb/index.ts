import ZCB_Issuer_ABI from '../abi-jsons/ZCB_Issuer.json'
import ZCB_ABI from '../abi-jsons/ZCB_V1.json'
import {getWeb3Instance} from "@/modules/web3";

import {BondInfo} from "@/components/pages/bonds/pages/issue/type";
import {TransactionReceipt} from "web3-core";
import {getTokenBalance} from "@/modules/web3/tokens";
import {BondInfoDetailed} from "@/modules/web3/type";
import {toBN} from "@/modules/web3/util";
import {defaultChain} from "@/modules/utils/wallet-connect";
import {Chain} from "wagmi";
import {ZCB_ISSUER_CONTRACTS} from "@/modules/web3/constants";

function getContract(chain: Chain, contractAddress: string) {
    const web3 = getWeb3Instance(chain)
    return new web3.eth.Contract(ZCB_ABI as any, contractAddress);
}

async function getBondInfo(chain: Chain, contractAddress: string): Promise<BondInfoDetailed> {
    const contract = getContract(chain, contractAddress);
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
        chainId: chain.id,
        issuer,
        total,
        purchased,
        redeemed,
        redeemLockPeriod,
        investmentToken,
        investmentTokenAmount,
        interestToken,
        interestTokenAmount,
        interestTokenBalance: await getTokenBalance(chain, interestToken, contractAddress),
        feePercentage,
        issuanceDate
    };
}

async function getTokensPurchaseDates(chain: any, contractAddress: string, tokenIds: number[]) {
    const contract = getContract(chain, contractAddress);
    return await contract.methods.getTokensPurchaseDates(tokenIds).call();
}

function issueBonds(chain: Chain, bondInfo: BondInfo): string | undefined {
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

    const web3 = getWeb3Instance(chain)
    const contract = new web3.eth.Contract(ZCB_Issuer_ABI as any, ZCB_ISSUER_CONTRACTS[chain.id]);
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

function purchase(chain: Chain, contractAddress: string, count: number) {
    const contract = getContract(chain, contractAddress)
    return contract.methods.purchase(count).encodeABI();
}

function redeem(chain: Chain, contractAddress: string, tokenIds: string[]) {
    const contract = getContract(chain, contractAddress)
    return contract.methods.redeem(tokenIds).encodeABI();
}

function withdrawRemaining(chain: Chain, contractAddress: string) {
    const contract = getContract(chain, contractAddress)
    return contract.methods.withdrawRemaining().encodeABI();
}

function changeOwner(chain: Chain, contractAddress: string, newAddress: string) {
    const contract = getContract(chain, contractAddress)
    return contract.methods.changeOwner(newAddress).encodeABI();
}

function issueMoreBonds(chain: Chain, contractAddress: string, amount: number) {
    const contract = getContract(chain, contractAddress)
    return contract.methods.issueBonds(amount).encodeABI();
}

function burnUnsoldBonds(chain: Chain, contractAddress: string, amount: number) {
    const contract = getContract(chain, contractAddress)
    return contract.methods.burnUnsoldBonds(amount).encodeABI();
}

function decode(transaction: TransactionReceipt): {} {

    const web3 = getWeb3Instance(defaultChain); // todo here it is hardcoded
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
    changeOwner,
    withdrawRemaining,
    burnUnsoldBonds,
    issueMoreBonds,
    decode,
    getBondInfo,
    getTokensPurchaseDates
}
