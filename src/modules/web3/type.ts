import {TokenResponse} from "@/modules/cloud-api/type";

type IssuerContractInfo = {
    issuanceFee: number
    purchaseRate: number
    earlyRedemptionRate: number;
    referrerRewardRate: number,
    isPaused: boolean;
}

type IssuerContractInfoDetailed = IssuerContractInfo & {
    issuanceFeeUI: string
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


type ExplorerTypes = "token" | "address" | "hash"

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
    value?: bigint
}

export type {
    IssuerContractInfo,
    IssuerContractInfoDetailed,
    TokenInfo,
    TokenResponseBalance,
    TokenResponseDetailed,
    ExplorerTypes,
    ContractInfoType,

}
