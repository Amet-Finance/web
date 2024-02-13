import {TokenResponse} from "@/modules/cloud-api/type";

type ContractQuery = {
    skip?: number,
    limit?: number,
    chainId?: number,
    contractAddresses?: string[], // JSON.stringify([contractAddress,contractAddress,])
    trending?: boolean,
    sortByBondScore?: "asc"|"desc"
}

type FinancialAttributeInfo = TokenResponse & {
    amount: string
    amountClean: number,
}

type ContractEssentialFormat = {
    _id: string, // combination of contractAddress and chainId

    total: number,
    purchased: number,
    redeemed: number,
    maturityPeriod: number,

    investment: FinancialAttributeInfo,
    interest: FinancialAttributeInfo,

    issuer: string,
    issuanceDate: Date,

}

type ContractBasicFormat = ContractEssentialFormat & {
    score: number,
    tbv: number
}

type ContractDescription = {
    name: string,
    description: string,
    external_url: string,
    image: string,
    details?: {
        title: string,
        description: string
    }
}

type ContractStats = {
    score: number,
    securedPercentage: number,
    issuerScore: number,
    uniqueHolders: number,
    tbv: number
}

type ContractExtendedInfoFormat = ContractEssentialFormat & {
    isSettled: boolean,
    purchaseFeePercentage: number,
    earlyRedemptionFeePercentage: number,
    issuanceBlock: number,
}

type ContractExtendedFormat = {
    contractDescription: ContractDescription,
    contractInfo: ContractExtendedInfoFormat,
    contractStats: ContractStats,
    lastUpdated: Date
}

export type  {
    ContractEssentialFormat,
    ContractDescription,
    FinancialAttributeInfo,
    ContractQuery,
    ContractBasicFormat,
    ContractExtendedFormat
}
