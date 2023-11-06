import {TokenInfo} from "@/modules/web3/type";

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
    investmentTokenInfo: TokenInfo;
    interestToken: string;
    interestTokenAmount: number;
    interestTokenInfo: TokenInfo;
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
    investmentTokenInfo?: TokenInfo | undefined;
    interestToken: string;
    interestTokenAmount: number;
    interestTokenInfo?: TokenInfo | undefined;
}

type Tokens = { [contractAddress: string]: TokenInfo }

type TokenDetails = {
    tokenInfo: TokenInfo,
    total: number,
    isLoading?: boolean,
    type: string,
    additionalInfo: any
}


export type  {
    BondGeneral,
    BondInfo,
    TokenDetails,
    Tokens
}
