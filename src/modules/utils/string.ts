function shortenString(str: string, int?: number) {
    return (int && str.length > int) ? str.slice(0, int) + '...' : str
}

export  {
    shortenString
}