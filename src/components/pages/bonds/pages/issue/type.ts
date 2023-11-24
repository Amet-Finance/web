import {TokenInfo, TokenResponseDetailed} from "@/modules/web3/type";
import {TokenResponse} from "@/modules/cloud-api/type";

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
    issuanceDate: number
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
    BondGeneral,
    BondInfo,
    TokenDetails
}
