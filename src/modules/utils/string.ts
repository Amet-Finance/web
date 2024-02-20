function shortenString(str: string|undefined, int?: number) {
    return (str && int && str.length > int) ? str.slice(0, int) + '...' : str
}

export {
    shortenString
}
