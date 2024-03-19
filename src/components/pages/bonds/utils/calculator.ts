import {ContractEssentialFormat, ContractEssentialFormatWithPayoutBalance} from "@/modules/cloud-api/contract-type";
import BigNumber from "bignumber.js";

function tbv(contractInfo: ContractEssentialFormat) {
    const {purchased, redeemed, payout, purchase} = contractInfo;

    return ((purchased * purchase.amountClean) * (purchase.priceUsd ?? 0)) + (redeemed * payout.amountClean * (payout.priceUsd ?? 0))
}


function score(contract: ContractEssentialFormatWithPayoutBalance) {
    const {_id, purchase, payout, issuerScore} = contract;
    const [_, chainId] = _id.split("_");

    const isBothAssetsVerified = payout?.isVerified && purchase?.isVerified;

    const uniqueHoldersIndex = contract.uniqueHolders ? contract.uniqueHolders / contract.totalBonds : 0;
    const securedPercentage = CalculatorController.securedPercentage(contract, true)

    return (0.45 * (securedPercentage / 10)) + (0.3 * issuerScore) + (0.05 * (isBothAssetsVerified ? 10 : 0)) + (0.2 * (uniqueHoldersIndex * 10));
}

function securedPercentage(contract: ContractEssentialFormatWithPayoutBalance, includeMin?: boolean) {
    const {payout} = contract;

    // todo do something if payout balance is missing
    const payoutBalanceClean = BigNumber(contract.payoutBalance.toString()).div(BigNumber(10).pow(BigNumber(payout.decimals))).toNumber()

    const notRedeemed = BigNumber(contract.totalBonds - contract.redeemed).times(payout.amountClean).toNumber();
    if (!notRedeemed) return 0; // this means all the bonds were purchased and redeemed

    const securedTmp = payoutBalanceClean * 100 / notRedeemed
    if (includeMin) {
        return Math.min(Number.isFinite(securedTmp) ? securedTmp : 0, 100);
    }

    return securedTmp;
}

const CalculatorController = {
    tbv,
    score,
    securedPercentage
}

export default CalculatorController;
