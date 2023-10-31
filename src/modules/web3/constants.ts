const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"
const ZCB_ISSUER_CONTRACT = '0xfa8c2f92b55cd2aaeac869587f8d333c7565e90a'


const TxTypes = {
    IssueBond: 'issue-bonds',
    ApproveToken: 'approve-token',
    PurchaseBonds: 'purchase-bonds',
    RedeemBonds: 'redeem-bonds',
    TransferERC20: "transfer-erc20",
    WithdrawRemaining: 'withdraw-remaining',
    ChangeOwner: 'change-owner',
    IssueMoreBonds: 'issue-more-bonds',
    BurnUnsoldBonds: 'burn-unsold-bonds'
}

const TransactionMessages = {
    success: `Transaction Succeeded`,
    error: `Transaction Failed`,
    pending: `Pending Transaction`
}

export {
    ZCB_ISSUER_CONTRACT,
    ZERO_ADDRESS,
    TxTypes,
    TransactionMessages
}
