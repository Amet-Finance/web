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

const LogTypes = {
    Purchase: "Purchase",
    Redeem: "Redeem",
    Transfer: "Transfer"
}

const BondContractTypes = {
    IBO: "IBO"
}

export {
    TxTypes,
    TransactionMessages,
    LogTypes,
    BondContractTypes
}
