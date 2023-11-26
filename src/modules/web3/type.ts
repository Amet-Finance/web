import {TokenResponse} from "@/modules/cloud-api/type";

type IssuerContractInfo = {
    issuanceFeeForUI: string,
    creationFee: number,
    creationFeeHex: string,
    creationFeePercentage: number,
    isPaused: boolean
}

type BondInfoDetailed = {
    _id: string,
    chainId: number,
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

type BondDescription = {
    name: string,
    description: string
    external_url: string,
    image: string,
    details?: {
        title?: string,
        description?: string
    }
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
    isFake?: boolean
}


type ExplorerTypes = "token" | "address"

type TokenResponseBalance = TokenResponse & {
    balance: number,
    balanceClean: string,
}

type TokenResponseDetailed = TokenResponseBalance & {
    unidentified?: boolean,
    isLoading?: boolean
}

type ContractInfoType = {
    to: string
    data: `0x${string}`,
    value?: string
}

export type {
    IssuerContractInfo,
    BondInfoDetailed,
    BondDescription,
    TokenInfo,
    TokenResponseBalance,
    TokenResponseDetailed,
    ExplorerTypes,
    ContractInfoType
}
