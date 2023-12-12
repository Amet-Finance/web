type ActivityLogs = {
    [txHash: string]: ActivityLog
}

type ActivityLog = {
    blockNumber: number,
    transactionHash: string,
    tokenIds: number[],
    from: string,
    to: string
}

export type {
    ActivityLogs,
    ActivityLog
}
