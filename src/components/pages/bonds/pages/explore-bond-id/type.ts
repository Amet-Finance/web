import {BondFinancialAttributeInfo} from "@/components/pages/bonds/utils/bond-card/type";

type BondContractDescription = {
    name: string,
    description: string,
    external_url: string,
    image: string,
    details?: {
        title: string,
        description: string
    }
}

type BondContractStats = {
    score: number,
    securedPercentage: number,
    issuerScore: number,
    uniqueHolders: number,
    tbv: number
}

type BondContractInfo = {
    contractAddress: string,
    chainId: number,

    issuer: string,

    total: number,
    purchased: number,
    redeemed: number,

    maturityPeriod: number

    investment: BondFinancialAttributeInfo,
    interest: BondFinancialAttributeInfo,

    isSettled: boolean,
    purchaseFeePercentage: number,
    earlyRedemptionFeePercentage: number,

    issuanceBlock: number,
    issuanceDate: Date,
}

type BondDetailed = {
    contractDescription: BondContractDescription,
    contractInfo: BondContractInfo,
    contractStats: BondContractStats,
    lastUpdated: Date
}


export type  {
    BondDetailed,
    BondContractInfo,
    BondContractDescription,
    BondContractStats
}
