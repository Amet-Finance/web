type AccountInfo = {
    address: string,
    chainId: number,
    isConnected: boolean
}

type LinkBaseType = {
    title: string,
    href: string,
    target?: string
}

type LinkExtendedType = LinkBaseType & {
    subLinks?: LinkBaseType[]
}

export type  {
    AccountInfo,
    LinkBaseType,
    LinkExtendedType
}
