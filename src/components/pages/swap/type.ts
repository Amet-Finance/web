import {TokenResponse} from "@/modules/cloud-api/type";

type TokenSelectorComponent = {
    tokenSelectorHandler: any,
    tokens: TokenResponse[],
    fromHandler: any,
    toHandler: any
}

type Result = {
    "inputAmount": string,
    "outputAmount": string,
    "totalGas": number,
    "gasPriceGwei": string,
    "gasUsd": number,
    "amountInUsd": number,
    "amountOutUsd": number,
    "receivedUsd": number,
    "swaps": any[]
    "tokens": {
        [contractAddress: string]: {
            "address": string,
            "symbol": string,
            "name": string,
            "price": number,
            "decimals": number
        }
    },
    "encodedSwapData": string,
    "routerAddress": string
}

export type {
    TokenSelectorComponent,
    Result
}
