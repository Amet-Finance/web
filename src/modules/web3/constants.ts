import {bscTestnet, manta, polygonMumbai} from "wagmi/chains";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"

const ZCB_ISSUER_CONTRACTS: { [chainId: number]: string } = {
    [polygonMumbai.id]: "0x90A18D3DfCe4ef0A263C28d00AfD2135424c1678",
    [manta.id]: "0x875B73364432d14EEb99eb0eAC6bAaCbEe6829E2",
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
    BurnUnsoldBonds: 'burn-unsold-bonds',
    DecreaseRedeemLockPeriod: 'decrease-redeem-lock-period'
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
