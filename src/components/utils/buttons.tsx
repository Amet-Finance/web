import React from "react";
import {StringKeyedObject} from "@/components/utils/types";

function BasicButton({
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
        onClick={isBlocked ? null : onClick}>
        {children}
    </button>
}

function DefaultButton({children, disabled, className, additionalClassName, classType = "", onClick}: Readonly<{
    children: React.ReactNode,
    disabled?: boolean,
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    className?: string,
    additionalClassName?: string
    classType?: string
}>) {

    const flexCenter = "flex items-center justify-center gap-2 py-1.5 w-full rounded-3xl"

    const ClassTypes: StringKeyedObject<string> = {
        '1': `${flexCenter} bg-white hover:bg-neutral-300 text-black`,
        '2': `${flexCenter} bg-white w-min h-full px-8 hover:bg-neutral-300`,
        '3': `${flexCenter} bg-red-500 hover:bg-red-600`,
        '4': `${flexCenter} bg-neutral-600 hover:bg-neutral-700`,
    }

    const generatedClass = className || ClassTypes[classType] + " " + additionalClassName || ""
    const finalClassName = generatedClass + ` ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`

    return (
        <button disabled={disabled} onClick={onClick}
                className={finalClassName}>
            {children}
        </button>
    )
}


export {
    BasicButton,
    DefaultButton
}
