import {TokenResponse} from "@/modules/api/type";
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

type FinancialAttributeInfo = TokenResponse & {
    amount: string
    amountClean: number,
}

type ContractCoreDetails = {
    contractAddress: string,
    chainId: number,

    totalBonds: number,
    purchased: number,
    redeemed: number,
    maturityPeriodInBlocks: number,

    purchase: FinancialAttributeInfo,
    payout: FinancialAttributeInfo,

    payoutBalance: string,

    issuer: string,
    issuerScore: number,
    uniqueHolders: number,

    owner: string,
    issuanceDate: Date | string,
    isSettled: boolean,
    issuanceBlock: number,
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
    ContractQuery,
    ContractExtendedFormat,
    DescriptionEditParams
}



