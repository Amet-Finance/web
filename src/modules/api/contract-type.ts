import {ContractBalance, TokenCore, TokenResponse, User} from "@/modules/api/type";
import {ActionLogFormat} from "@/components/pages/bonds/pages/explore-bond-id/type";

type AccountInformationQuery = {
    address: string,
    chainId: number
}

type ContractQuery = {
    chainId: number,
    skip?: number,
    limit?: number,
    contractAddress?: string,

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
    uri: string,

    block: number, // the last updated block(current block) from The Graph
    contractAddress: string,
    chainId: number,

    totalBonds: number,
    purchased: number,
    redeemed: number,
    maturityPeriodInBlocks: number,

    payoutBalance: string,

    issuer: string,

    owner: string,
    issuanceDate: Date | string,
    isSettled: boolean,
    issuanceBlock: number,
    referrerRewardRate: number,
    purchaseRate: number,
    earlyRedemptionRate: number,
}

type ContractInfoDetails = ContractDetails & PurchasePayoutInfo

type ContractCoreDetails = ContractDetails & PurchasePayoutExtended

type ContractDescription = {
    name: string,
    isInitiated: boolean,
    description?: string,
    external_url?: string,
    image?: string,
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
    contractAddress: string,
    chainId: number
    title: string,
    description: string
}

type EmailEditParams = {
    email: string
}

type AccountHoldings = {
    balances: (ContractBalance & { bond: ContractCoreDetails })[],
    issued: ContractCoreDetails[]
}

type AccountExtendedFormat = User & AccountHoldings

export type  {
    AccountHoldings,
    AccountInformationQuery,
    ContractCoreDetails,
    ContractDescription,
    FinancialAttributeInfo,
    FinancialAttributeExtended,
    ContractQuery,
    ContractExtendedFormatAPI,
    ContractExtendedFormat,
    DescriptionEditParams,
    AccountExtendedFormat,
    EmailEditParams
}



