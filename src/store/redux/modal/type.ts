import {BondInfo} from "@/components/pages/bonds/pages/issue/type";
import {TransactionReceipt} from "viem";


type Modal = {
    type: string,
    additional?: {
        // todo all the params that may be in the additional
        bondInfo?: BondInfo,
        transaction?: TransactionReceipt
        decoded?: { [key: string]: any }
    }
}
export type {
    Modal
}
