import {ContractExtendedFormat} from "@/modules/api/contract-type";
import {StringKeyedObject} from "@/components/utils/general";

type ExploreIdQueryParams = {
    contractAddress: string,
    chainId: number,
}

type ExploreBondIdType = {
    bondDetailedTmp: ContractExtendedFormat,
    queryParams: ExploreIdQueryParams
}

type ActionLogFormat = {
    id: string
    from: string,
    to: string,
    count: number, // 25 tokens
    type: string,
    block: number
}

type Balance = StringKeyedObject<StringKeyedObject<number>>

export type  {
    ExploreBondIdType,
    ExploreIdQueryParams,
    ActionLogFormat,
    Balance
}
