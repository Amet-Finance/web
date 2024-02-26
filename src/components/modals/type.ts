import {TransactionReceipt} from "viem";

type IssueBondSuccessAdditional = {
    transaction: TransactionReceipt,
    decoded: {
        bondAddress: string
    },
    chainId: number
}

export type {
    IssueBondSuccessAdditional
}
