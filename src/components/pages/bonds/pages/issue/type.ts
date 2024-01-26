import {IssuerContractInfoDetailed, TokenInfo, TokenResponseDetailed} from "@/modules/web3/type";
import {TokenResponse, TokensResponse} from "@/modules/cloud-api/type";

type BondInfoForIssuance = {
    total: number,
    maturityPeriod: number,
    chainId: number,
    investmentToken: string,
    investmentAmount: number,
    interestToken: string,
    interestAmount: number
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


type BondGeneral = {
    _id: string;
    chainId: string;
    issuer: string;
    total: number;
    purchased: number;
    redeemed: number;
    redeemLockPeriod: number;
    investmentToken: string;
    investmentTokenAmount: number;
    investmentTokenInfo: TokenResponse;
    interestToken: string;
    interestTokenAmount: number;
    interestTokenInfo: TokenResponse;
    issuanceDate: number;
    trending?: boolean
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

type TokenDetails = {
    tokenInfo: TokenResponseDetailed,
    total: number,
    isLoading?: boolean,
    type: string,
    additionalInfo: any
}


export type  {
    BondInfoForIssuance,
    BondData,
    BondCombinedData,
    BondAndTokenDataWithType,
    BondAndTokenData,


    BondGeneral,
    BondInfo,
    TokenDetails,
}
