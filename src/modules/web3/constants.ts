import {polygon} from "viem/chains";
import {joltevmDev} from "@/modules/utils/custom-chains";
import {arbitrum, base} from "wagmi/chains";

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

const CHAIN_BLOCK_TIMES: { [chainId: number | string]: number } = {
    [polygon.id]: 2,
    [base.id]: 2,
    [arbitrum.id]: 0.25,
    [joltevmDev.id]: 10
}

const FIXED_FLEX_ISSUER_CONTRACTS: { [chainId: number | string]: string[] } = {
    [base.id]: ["0xE67BE43603260b0AD38bBfe89FcC6fDe6741e82A"],
    [arbitrum.id]: ["0x65A8d1EcC30351328BDf86612Ae31e46172c4DA9"],
    [joltevmDev.id]: ["0x875B73364432d14EEb99eb0eAC6bAaCbEe6829E2"],
}



const GRAPH_CONFIG: {[chainId: number]: {startBlock: number, url: string}} = {
    [base.id]: {
        startBlock: 14022551,
        url: "https://subgraph.satsuma-prod.com/10c8c7e96744/unconstraineds-team--970943/Amet-Finance-8453/api",
    },
    [arbitrum.id]: {
        startBlock: 218790445,
        url: "https://gateway-arbitrum.network.thegraph.com/api/07d0ecc03fc3f9aeffea03e59ee0f10f/subgraphs/id/4cT2qznsGi3npkRR6y2WuUPoEGMwcpUDewdCCJ6wHrvh",
    }
}

export {
    TxTypes,
    TransactionMessages,
    LogTypes,
    BondContractTypes,
    CHAIN_BLOCK_TIMES,
    FIXED_FLEX_ISSUER_CONTRACTS,
    GRAPH_CONFIG
}
