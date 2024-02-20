import {ContractExtendedFormat} from "@/modules/cloud-api/contract-type";

type ExploreIdQueryParams = {
    contractAddress: string,
    chainId: number,
}

type ExploreBondIdType = {
    bondDetailedTmp: ContractExtendedFormat,
    queryParams: ExploreIdQueryParams
}

type ActionLogFormat = {
    from: string,
    to: string,
    count: number, // 25 tokens
    type: string,
    hash: string
    block: number
}

type Balance = { [contractId: string]: { [id: string]: number } }

export type  {
    ExploreBondIdType,
    ExploreIdQueryParams,
    ActionLogFormat,
    Balance
}
