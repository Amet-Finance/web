import {bscTestnet, polygonMumbai} from "wagmi/chains";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"

const ZCB_ISSUER_CONTRACTS: { [chainId: number]: string } = {
    [polygonMumbai.id]: "0x8F0A753b24b77AA8C1D9d56324e0abA14b900C16",
    [bscTestnet.id]: ""
}

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
    ZCB_ISSUER_CONTRACTS,
    ZERO_ADDRESS,
    TxTypes,
    TransactionMessages
}
