import {TokenInfo} from "@/modules/web3/type";

type BondFinancialAttributeInfo = TokenInfo & {
    amount: string,
    amountClean: number,
}


type BondCardInfo = {
    contractAddress: string,
    chainId: number

    investment: BondFinancialAttributeInfo,
    interest: BondFinancialAttributeInfo,

    total: number,
    purchased: number,
    redeemed: number,

    maturityPeriod: number,

    issuer: string,
    issuanceDate: string,

    score: number,
    tbv: number
}

export type  {
    BondCardInfo,
    BondFinancialAttributeInfo
}
