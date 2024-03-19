import {IssuerContractInfoDetailed, TokenResponseDetailed} from "@/modules/web3/type";
import {TokensResponse} from "@/modules/cloud-api/type";

type BondInfoForIssuance = {
    totalBonds: number,
    maturityPeriodInBlocks: number,
    chainId: number,
    purchaseToken: string,
    purchaseAmount: number,
    payoutToken: string,
    payoutAmount: number
}

type BondData = {
    bondInfoHandler: [BondInfoForIssuance, any],
}

type BondAndTokenData = BondData & {
    tokensHandler: [TokensResponse, any]
}

type BondAndTokenDataWithType = BondAndTokenData & {
    type: string
}

type BondCombinedData = BondAndTokenData & {
    issuerContractInfo: IssuerContractInfoDetailed
}

type BondInfo = {
    _id: string;
    issuer: string;
    total: number;
    purchased: number;
    redeemed: number;
    redeemLockPeriod: number;
    investmentToken: string;
    investmentTokenAmount: number;
    investmentTokenInfo?: TokenResponseDetailed | undefined;
    interestToken: string;
    interestTokenAmount: number;
    interestTokenInfo?: TokenResponseDetailed | undefined;
}


export type  {
    BondInfoForIssuance,
    BondData,
    BondCombinedData,
    BondAndTokenDataWithType,
    BondAndTokenData,

    BondInfo,
}
