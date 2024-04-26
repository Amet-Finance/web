import {BondInfo} from "@/components/pages/bonds/pages/issue/type";
import {TransactionReceipt} from "viem";
import {StringKeyedObject} from "@/components/utils/types";


type ModalState = {
    type: string,
    additional?: {
        // todo all the params that may be in the additional
        bondInfo?: BondInfo,
        transaction?: TransactionReceipt
        decoded?: StringKeyedObject<any>
    }
}
export type {
    ModalState
}
