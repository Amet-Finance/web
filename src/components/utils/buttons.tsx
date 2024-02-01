export function BasicButton({children, isBgWhite, isBgGrey, isWhiteBorder, onClick, wMin}: {
    children: any,
    isBgWhite?: boolean,
    isBgGrey?: boolean,
    isWhiteBorder?: boolean,
    onClick?: any,
    wMin?: boolean
}) {

    let classOnBg = (!isBgWhite ? 'bg-white hover:bg-neutral-300 text-black ' : 'bg-black hover:bg-neutral-800 text-white ') + "px-8 py-2.5"
    if (isBgGrey) {
        classOnBg = "bg-neutral-900 hover:bg-neutral-800 text-black p-5"
    }


    if(isWhiteBorder) classOnBg = "text-white bg-transparent border border-w1 hover:bg-neutral-950 text-black"

    if(wMin) classOnBg += " w-min"

    return (<>
        <button className={`w-full ${classOnBg} h-full flex justify-center items-center gap-2 rounded-full whitespace-nowrap font-medium cursor-pointer px-8`} onClick={onClick}>
            {children}
        </button>
    </>);
}
