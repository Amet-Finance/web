import {TransactionReceipt} from "viem";

type IssueBondSuccessAdditional = {
    transaction: TransactionReceipt,
    decoded: any[]
    chainId: number
}

export type {
    IssueBondSuccessAdditional
}
