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

    const ClassTypes: StringKeyedObject<string> = {
        '1': "flex items-center justify-center gap-2 bg-white text-black rounded-md py-1 hover:bg-neutral-300 text-sm px-4 w-full",
        '2': "bg-white w-min h-full px-4 rounded-md hover:bg-neutral-300",
        '3': "flex items-center justify-center gap-2 bg-red-500 rounded-md py-1 w-full hover:bg-red-600",
        '4': "flex items-center justify-center gap-2 bg-neutral-600 rounded-md py-1 w-full hover:bg-neutral-700",
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
