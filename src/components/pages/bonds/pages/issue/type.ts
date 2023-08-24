import {TokenInfo} from "@/modules/web3/type";

type BondInfo = {
    issuer?: string;
    _id?: string;
    total?: number;
    current?: number;
    redeemLockPeriod?: number;
    investmentToken?: string;
    investmentTokenAmount?: number;
    investmentTokenInfo?: TokenInfo;
    interestToken?: string;
    interestTokenAmount?: number;
    interestTokenInfo?: TokenInfo;
}

type TokenDetails = {
    tokenInfo: TokenInfo|undefined,
    total: number,
    isLoading: boolean,
    type: string
}


export type  {
    BondInfo,
    TokenDetails
}