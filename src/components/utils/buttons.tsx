export function BasicButton({
                                children,
                                isBgWhite,
                                isBgGrey,
                                isWhiteBorder,
                                onClick,
                                wMin,
                                hFull,
                                isBlocked,
                                className
                            }: Readonly<{
    children: any,
    isBgWhite?: boolean,
    isBgGrey?: boolean,
    isWhiteBorder?: boolean,
    onClick?: any,
    wMin?: boolean,
    hFull?: boolean,
    isBlocked?: boolean
    className?: string
}>) {

    let generalClass = "px-8 py-2.5";
    let classOnBg = (!isBgWhite ? 'bg-white hover:bg-neutral-300 text-black ' : 'bg-black hover:bg-neutral-800 text-white ') + generalClass;
    if (isBgGrey) classOnBg = "bg-neutral-900 hover:bg-neutral-800 text-black p-5";


    if (isWhiteBorder) classOnBg = "text-white bg-transparent border border-w1 hover:bg-neutral-950 text-black px-8";

    if (wMin) classOnBg += " w-min";
    if (hFull) classOnBg += " h-full";

    classOnBg += `${isBlocked ? " cursor-not-allowed" : " cursor-pointer"}`

    return <button
        className={`w-full ${classOnBg} flex justify-center items-center gap-2 rounded-full whitespace-nowrap font-medium ${className}`}
            onClick={onClick}>
            {children}
        </button>
}
