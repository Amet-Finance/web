import {TokenCore, TokenResponse} from "@/modules/api/type";
import {ActionLogFormat} from "@/components/pages/bonds/pages/explore-bond-id/type";

type ContractQuery = {
    chainId: number,
    skip?: number,
    limit?: number,
    contractAddress?: string, // JSON.stringify([contractAddress,contractAddress,])

    trending?: boolean,
    sortByBondScore?: "asc"|"desc",
    issuer?: string
    purchaseToken?: string,
    payoutToken?: string
}

type AmountInfo = {
    amount: string
    amountClean: number,
}

type FinancialAttributeInfo = TokenCore & AmountInfo

type FinancialAttributeExtended = TokenResponse & AmountInfo

type PurchasePayoutInfo = {
    purchase: FinancialAttributeInfo,
    payout: FinancialAttributeInfo,
}

type PurchasePayoutExtended = {
    purchase: FinancialAttributeExtended,
    payout: FinancialAttributeExtended,
}

type ContractDetails = {
    contractAddress: string,
    chainId: number,

    totalBonds: number,
    purchased: number,
    redeemed: number,
    maturityPeriodInBlocks: number,

    payoutBalance: string,

    issuer: string,
    issuerScore: number,
    uniqueHolders: number,

    owner: string,
    issuanceDate: Date | string,
    isSettled: boolean,
    issuanceBlock: number,
}

type ContractInfoDetails = ContractDetails & PurchasePayoutInfo

type ContractCoreDetails = ContractDetails & PurchasePayoutExtended

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

type ContractExtendedFormatAPI = {
    contractDescription: ContractDescription,
    contractInfo: ContractInfoDetails,
    actionLogs: ActionLogFormat[],
    lastUpdated?: Date | string
}


type ContractExtendedFormat = {
    contractDescription: ContractDescription,
    contractInfo: ContractCoreDetails,
    actionLogs: ActionLogFormat[],
    lastUpdated?: Date | string
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
    ContractCoreDetails,
    ContractDescription,
    FinancialAttributeInfo,
    FinancialAttributeExtended,
    ContractQuery,
    ContractExtendedFormatAPI,
    ContractExtendedFormat,
    DescriptionEditParams
}



