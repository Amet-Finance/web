import {ContractCoreDetails} from "@/modules/api/contract-type";
import BigNumber from "bignumber.js";

function tbv(contractInfo: ContractCoreDetails) {
    const {purchased, redeemed, payout, purchase} = contractInfo;

    return ((purchased * purchase.amountClean) * (purchase.priceUsd ?? 0)) + (redeemed * payout.amountClean * (payout.priceUsd ?? 0))
}


function score(contract: ContractCoreDetails) {
    const {purchase, payout} = contract;
    const isBothAssetsVerified = payout?.isVerified && purchase?.isVerified;

    const calculatedYield = yieldRate(contract);
    const securedPercentage = CalculatorController.securedPercentage(contract, true);

    return (0.7 * (securedPercentage / 10)) + (0.2 * (isBothAssetsVerified ? 10 : 0) + (0.1 * Math.min(calculatedYield, 100) / 10));
}

function securedPercentage(contract: ContractCoreDetails, includeMin?: boolean) {
    const {payout, payoutBalance, totalBonds, redeemed,} = contract;

    // todo do something if payout balance is missing
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
    return ((payoutPriceUsd - purchasePriceUsd) * 100) / purchasePriceUsd
}

const CalculatorController = {
    tbv,
    score,
    securedPercentage,
    yieldRate
}

export default CalculatorController;
