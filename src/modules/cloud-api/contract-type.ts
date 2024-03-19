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

    issuer: string,
    issuerScore: number,
    uniqueHolders: number,

    owner: string,
    issuanceDate: Date,
    isSettled: boolean,
    issuanceBlock: number,
}

type ContractEssentialFormatWithPayoutBalance = ContractEssentialFormat & { payoutBalance: string }

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

type ContractExtendedFormat = {
    contractDescription: ContractDescription,
    contractInfo: ContractEssentialFormatWithPayoutBalance,
    lastUpdated: Date
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
    ContractEssentialFormatWithPayoutBalance,
    ContractDescription,
    FinancialAttributeInfo,
    ContractQuery,
    ContractExtendedFormat,
    DescriptionEditParams
}



