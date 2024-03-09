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

    totalBonds: number,
    purchased: number,
    redeemed: number,
    maturityPeriodInBlocks: number,

    purchase: FinancialAttributeInfo,
    payout: FinancialAttributeInfo,
    payoutBalance: string,

    issuer: string,
    owner: string,
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
    issuanceBlock: number,
}

type ContractExtendedFormat = {
    contractDescription: ContractDescription,
    contractInfo: ContractExtendedInfoFormat,
    contractStats: ContractStats,
    lastUpdated: Date
}

type ContractExtendedFormatV2 = ContractExtendedFormat & {

}


type DescriptionEditParams = {
    _id: string
    address :string,
    signature: string,
    message: string,
    title: string,
    description: string
}

export type  {
    ContractEssentialFormat,
    ContractDescription,
    ContractExtendedInfoFormat,
    ContractStats,
    FinancialAttributeInfo,
    ContractQuery,
    ContractBasicFormat,
    ContractExtendedFormat,
    ContractExtendedFormatV2,
    DescriptionEditParams
}
