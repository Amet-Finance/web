function shorten(address: string, length = 6) {
    if (address.length <= length) {
        return address;
    }

    const start = address.substring(0, length);
    const end = address.substring(address.length - length);

    return `${start}...${end}`;
}

export  {
    shorten
}