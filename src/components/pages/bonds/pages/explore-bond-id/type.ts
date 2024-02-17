type ExploreIdQueryParams = {
    contractAddress: string,
    chainId: number,
}

type LogFormat = {
    from: string,
    to: string,
    value: string,
    type: string,
    hash: string
    block: number
}

export type  {
    ExploreIdQueryParams,
    LogFormat
}
