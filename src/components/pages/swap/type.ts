import {TokenResponse} from "@/modules/cloud-api/type";

type TokenSelectorComponent = {
    tokenSelectorHandler: any,
    tokens: TokenResponse[],
    fromHandler: any,
    toHandler: any
}

export type {
    TokenSelectorComponent
}
