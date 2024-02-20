import {bsc, manta, optimism, polygon, polygonMumbai, polygonZkEvm, zetachainAthensTestnet} from "wagmi/chains";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"

const ZCB_ISSUER_CONTRACTS: { [chainId: number]: string } = {
    // [polygon.id]: "0x875B73364432d14EEb99eb0eAC6bAaCbEe6829E2",
    // [polygonZkEvm.id]: "0x875B73364432d14EEb99eb0eAC6bAaCbEe6829E2",
    // [manta.id]: "0x875B73364432d14EEb99eb0eAC6bAaCbEe6829E2",
    // [optimism.id]: "0x875B73364432d14EEb99eb0eAC6bAaCbEe6829E2",
    // [bsc.id]: "0x875B73364432d14EEb99eb0eAC6bAaCbEe6829E2",
    //
    // [zetachainAthensTestnet.id]: "0x875B73364432d14EEb99eb0eAC6bAaCbEe6829E2",
    [polygonMumbai.id]: "0x8F013B542A0487ed7B4Eb51cD8f3A0fF59AafAEe",
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

const BlockTimes: any = {
    [polygon.id]: 2,
    [polygonMumbai.id]: 4
}

export {
    ZCB_ISSUER_CONTRACTS,
    ZERO_ADDRESS,
    TxTypes,
    TransactionMessages,
    BlockTimes
}
