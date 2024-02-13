import {TransactionReceipt} from "viem";

type IssueBondSuccessAdditional = {
    transaction: TransactionReceipt,
    decoded: {
        contractAddress: string
    },
    chainId: number
}

export type {
    IssueBondSuccessAdditional
}
