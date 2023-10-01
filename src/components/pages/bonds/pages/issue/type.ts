import {TokenInfo} from "@/modules/web3/type";

type BondGeneral = {
    _id?: string;
    issuer: string;
    total: number;
    purchased: number;
    redeemed: number;
    redeemLockPeriod: number;
    investmentToken: string;
    investmentTokenAmount: number;
    investmentTokenInfo: TokenInfo;
    interestToken: string;
    interestTokenAmount: number;
    interestTokenInfo: TokenInfo;
}

type BondInfo = {
    _id?: string;
    issuer?: string;
    total?: number;
    purchased: number;
    redeemed: number;
    redeemLockPeriod?: number;
    investmentToken?: string;
    investmentTokenAmount?: number;
    investmentTokenInfo?: TokenInfo|undefined;
    interestToken?: string;
    interestTokenAmount?: number;
    interestTokenInfo?: TokenInfo|undefined;
}

type TokenDetails = {
    tokenInfo: TokenInfo|undefined,
    total: number,
    isLoading?: boolean,
    type: string
}


export type  {
    BondGeneral,
    BondInfo,
    TokenDetails
}