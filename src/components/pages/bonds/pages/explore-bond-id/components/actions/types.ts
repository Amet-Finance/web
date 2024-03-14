type ActionHeadlineComponent = {
    type: string,
    icon: string,
    title: string,
    addon?: { total?: number, onlyOwner?: boolean, owner?: string }
}

// todo updates needed after contracts changed
type ReferralInfo = {
    quantity: number,
    isRepaid: boolean
}

export type {
    ActionHeadlineComponent,
    ReferralInfo
}
