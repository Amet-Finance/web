type BondInfoDetailed = {
    _id: string,
    issuer: string,
    total: number,
    purchased: number,
    redeemed: number,
    redeemLockPeriod: number,
    investmentToken: string,
    investmentTokenAmount: string,
    interestToken: string,
    interestTokenAmount: number,
    interestTokenBalance: string,
    feePercentage: number,
    issuanceDate: number
}

type TokenInfo = {
    contractAddress: string,
    name: string,
    symbol: string,
    decimals: number,
    verified?: boolean,
    unidentified?: boolean,
    icon: string,
    balance?: number,
    balanceClean?: string,
    isLoading?: boolean
}

type Chain = {
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

type SwitchChain = {
    chainId: string
    type: string
}

type ConnectWallet = {
    type?: string;
    chainId: string;
    requestChain?: boolean;
    requestAccounts?: boolean;
    hideError?: boolean;
    callback?: any;
}

export type {
    BondInfoDetailed,
    TokenInfo,
    Chain,
    SwitchChain,
    ConnectWallet
}