import {StringKeyedObject} from "@/components/utils/types";
import {base} from "wagmi/chains";
import {BondContractTypes} from "@/modules/web3/constants";

const priorityBonds: StringKeyedObject<StringKeyedObject<{ type: string, score: number }>> = {
    [base.id]: {
        "0xa6693f3c87ac6f853159a72e54144a7ede784661": {
            type: BondContractTypes.IBO,
            score: 50
        }
    }
}

export {
    priorityBonds
}
