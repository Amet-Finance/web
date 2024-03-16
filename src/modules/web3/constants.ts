import {polygon, polygonMumbai} from "wagmi/chains";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"

const FIXED_FLEX_ISSUER_CONTRACTS: { [chainId: number]: string } = {
    [polygonMumbai.id]: "0x0FBE72137231B40569e3292B6f5927db41F0f3c2",
}

const TxTypes = {
    IssueBond: 'issue-bonds',
    ApproveToken: 'approve-token',
    PurchaseBonds: 'purchase-bonds',
    RedeemBonds: 'redeem-bonds',
    Settle: 'settle',
    ClaimReferralRewards: 'claim-referral-rewards',
    TransferERC20: "transfer-erc20",
    WithdrawExcessPayout: "withdraw-excess-payout",
    UpdateBondSupply: 'update-bond-supply',
    DecreaseMaturityPeriod: 'decrease-maturity-period',

    ChangeOwner: 'change-owner',
    IssueMoreBonds: 'issue-more-bonds',
    BurnUnsoldBonds: 'burn-unsold-bonds',
    DecreaseRedeemLockPeriod: 'decrease-redeem-lock-period'
}

const TransactionMessages = {
    success: `Transaction Succeeded`,
    error: `Transaction Failed`,
    pending: `Pending Transaction`
}

const BlockTimes: any = {
    [polygon.id]: 2,
    [polygonMumbai.id]: 4
}

export {
    FIXED_FLEX_ISSUER_CONTRACTS,
    ZERO_ADDRESS,
    TxTypes,
    TransactionMessages,
    BlockTimes
}
