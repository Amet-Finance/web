function isMobile() {
    return (/Mobi|Android/i).test(window?.navigator?.userAgent)
}

export {
    isMobile
}