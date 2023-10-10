import {Chain} from "@/modules/web3/type";

const CHAIN_IDS = {
    Ethereum: "0x1",
    Mumbai: "0x13881",
    Polygon: "0x89"
}

const RPC_BY_CHAINS: { [key: string]: string[] } = {
    [CHAIN_IDS.Ethereum]: ["https://eth.llamarpc.com"],
    [CHAIN_IDS.Mumbai]: ["https://rpc-mumbai.maticvigil.com"],
    [CHAIN_IDS.Polygon]: ["https://rpc-mainnet.matic.quiknode.pro"]
}

const CHAIN_INFO: { [key: string]: Chain } = {
    [CHAIN_IDS.Ethereum]: {
        chainId: CHAIN_IDS.Ethereum,
        chainName: "Ethereum",
        rpcUrls: RPC_BY_CHAINS[CHAIN_IDS.Ethereum],
        nativeCurrency: {
            name: "Ethereum",
            symbol: "ETH",
            decimals: 18
        },
        blockExplorerUrls: ["https://etherescan.io"]
    },
    [CHAIN_IDS.Polygon]: {
        chainId: CHAIN_IDS.Polygon,
        chainName: "Polygon",
        rpcUrls: RPC_BY_CHAINS[CHAIN_IDS.Polygon],
        nativeCurrency: {
            name: "MATIC",
            symbol: "MATIC",
            decimals: 18
        },
        blockExplorerUrls: ["https://polygonscan.com"]
    },
    [CHAIN_IDS.Mumbai]: {
        chainId: CHAIN_IDS.Mumbai,
        chainName: "Mumbai Testnet",
        rpcUrls: RPC_BY_CHAINS[CHAIN_IDS.Mumbai],
        nativeCurrency: {
            name: "MATIC",
            symbol: "MATIC",
            decimals: 18
        },
        blockExplorerUrls: ["https://mumbai.polygonscan.com"]
    }

}

const WalletTypes = {
    Metamask: 'metamask'
}

const DEFAULT_CHAIN_ID = CHAIN_IDS.Mumbai;

const TxTypes = {
    IssueBond: 'issue-bonds',
    ApproveToken: 'approve-token',
    PurchaseBonds: 'purchase-bonds',
    RedeemBonds: 'redeem-bonds',
    TransferERC20: "transfer-erc20",
    WithdrawRemaining: 'withdraw-remaining'
}

export {
    DEFAULT_CHAIN_ID,
    CHAIN_IDS,
    CHAIN_INFO,
    RPC_BY_CHAINS,
    WalletTypes,
    TxTypes
}