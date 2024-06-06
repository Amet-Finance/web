import {ContractCoreDetails} from "@/modules/api/contract-type";
import BigNumber from "bignumber.js";
import {CHAIN_BLOCK_TIMES} from "@/modules/web3/constants";

function tbv(contractInfo: ContractCoreDetails) {
    const {purchased, redeemed, payout, purchase} = contractInfo;

    return ((purchased * purchase.amountClean) * (purchase.priceUsd ?? 0)) + (redeemed * payout.amountClean * (payout.priceUsd ?? 0))
}


function score(contract: ContractCoreDetails) {
    const {purchase, payout, isSettled} = contract;
    const isBothAssetsVerified = payout?.isVerified && purchase?.isVerified;

    const calculatedYield = yieldRate(contract);
    const securedPercentage = CalculatorController.securedPercentage(contract, true);

    return (0.6 * (securedPercentage / 10)) + (isSettled ? 1 : 0) + (0.2 * (isBothAssetsVerified ? 10 : 0) + (0.1 * Math.min(calculatedYield, 100) / 10));
}

function securedPercentage(contract: ContractCoreDetails, includeMin?: boolean) {
    const {payout, payoutBalance, totalBonds, redeemed} = contract;

    const payoutBalanceClean = BigNumber(payoutBalance.toString()).div(BigNumber(10).pow(BigNumber(payout.decimals))).toNumber()
    const notRedeemed = BigNumber(totalBonds - redeemed).times(payout.amountClean).toNumber();
    if (!notRedeemed) return 0; // this means all the bonds were purchased and redeemed

    const securedTmp = payoutBalanceClean * 100 / notRedeemed
    if (includeMin) {
        return Math.min(Number.isFinite(securedTmp) ? securedTmp : 0, 100);
    }

    return securedTmp;
}

function yieldRate({purchase, payout}: ContractCoreDetails): number {
    const payoutPriceUsd = payout.amountClean * (payout.priceUsd ?? 0);
    const purchasePriceUsd = purchase.amountClean * (purchase.priceUsd ?? 0)

    const yieldRate = ((payoutPriceUsd - purchasePriceUsd) * 100) / purchasePriceUsd;
    return Number.isFinite(yieldRate) ? yieldRate : 0;
}

function apr(contractCoreDetails: ContractCoreDetails) {
    const {chainId, maturityPeriodInBlocks} = contractCoreDetails;
    const yieldPercentage = yieldRate(contractCoreDetails);
    const secondsToMature = maturityPeriodInBlocks * CHAIN_BLOCK_TIMES[chainId]
    const oneYearInSeconds = 365 * 24 * 60 * 60;

    const timesInYear = oneYearInSeconds / secondsToMature;

    return timesInYear * yieldPercentage;
}

const CalculatorController = {
    tbv,
    score,
    securedPercentage,
    yieldRate,
    apr
}

export default CalculatorController;
