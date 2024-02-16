type AccountInfo = {
    address: string,
    chainId: number,
    isConnected: boolean
}

type LinkBase = {
    title: string,
    href: string,
    target?: string
}

type LinkExtended = LinkBase & {
    subLinks?: LinkBase[]
}

export type  {
    AccountInfo,
    LinkBase,
    LinkExtended
}
