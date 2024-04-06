import {TokenResponse} from "@/modules/api/type";
import {BigNumber} from "ethers"

type IssuerContractInfo = {
    issuanceFee: BigNumber
    purchaseRate: number
    earlyRedemptionRate: number;
    referrerRewardRate: number,
    isPaused: boolean;
}

type IssuerContractInfoDetailed = IssuerContractInfo & {
    issuanceFeeUI: string
}

type ExplorerTypes = "token" | "address" | "hash"

type TokenResponseBalance = TokenResponse & {
    pureBalance: string;
    normalizedBalance: number;
}

type TokenResponseDetailed = TokenResponseBalance & {
    unidentified?: boolean,
    isLoading?: boolean
}

type ContractInfoType = {
    to: string
    data: `0x${string}` | string,
    value?: bigint
}

export type {
    IssuerContractInfo,
    IssuerContractInfoDetailed,
    TokenResponseBalance,
    TokenResponseDetailed,
    ExplorerTypes,
    ContractInfoType,

}
