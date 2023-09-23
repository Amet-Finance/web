const CHAIN_IDS = {
    Ethereum: "0x1",
    Mumbai: "0x13881"
}

const RPC_BY_CHAINS: { [key: string]: string[] } = {
    [CHAIN_IDS.Ethereum]: ["https://eth.llamarpc.com"],
    [CHAIN_IDS.Mumbai]: ["https://rpc-mumbai.maticvigil.com"]
}

const CHAIN_INFO: {
    [key: string]: {
        chainId: string,
        chainName: string,
        rpcUrls: string[],
        nativeCurrency: {
            "name": string,
            "symbol": string,
            "decimals": number
        },
        blockExplorerUrls: string[]
    }
} = {
    [CHAIN_IDS.Mumbai]: {
        chainId: CHAIN_IDS.Mumbai,
        chainName: "Mumbai",
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
    RedeemBonds: 'redeem-bonds'
}

export {
    DEFAULT_CHAIN_ID,
    CHAIN_IDS,
    CHAIN_INFO,
    RPC_BY_CHAINS,
    WalletTypes,
    TxTypes
}