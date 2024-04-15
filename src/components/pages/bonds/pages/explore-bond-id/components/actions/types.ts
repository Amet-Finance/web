type ActionHeadlineComponent = {
    type: string,
    icon: string,
    title: string,
    addon?: { total?: string|number, onlyOwner?: boolean, owner?: string }
}

type ReferralInfo = {
    quantity: number,
    claimed: number
}

export type {
    ActionHeadlineComponent,
    ReferralInfo
}
