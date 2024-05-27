import {URLS} from "@/modules/utils/urls";
import Link from "next/link";
import {ConditionalRenderer} from "@/components/utils/container";
import {InfoBoxData} from "@/components/utils/types";
import React, {ReactNode} from "react";

function InfoBox({children, info, isRight, className, parentClassName}: Readonly<InfoBoxData>) {

    const isBlank = info.isBlank || !info.link;

    const url = info.link ?? URLS.FAQ_INVESTOR;
    const target = isBlank ? "_blank" : "_self";

    return (
        <div className="relative flex items-center gap-1 w-min">
            {children}
            <div className={`flex justify-end group w-full ${parentClassName}`}>
                <Link href={url} target={target} title='Click to learn more!'>
                    <svg
                        width="20px"
                        height="20px"
                        viewBox="0 0 24 24"
                        fill="none" xmlns="http://www.w3.org/2000/svg"
                        className='cursor-help'>
                        <path fillRule="evenodd" clipRule="evenodd"
                              d="M19.5 12C19.5 16.1421 16.1421 19.5 12 19.5C7.85786 19.5 4.5 16.1421 4.5 12C4.5 7.85786 7.85786 4.5 12 4.5C16.1421 4.5 19.5 7.85786 19.5 12ZM21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12ZM11.25 13.5V8.25H12.75V13.5H11.25ZM11.25 15.75V14.25H12.75V15.75H11.25Z"
                              fill="#888888"/>
                    </svg>
                </Link>
                <ConditionalRenderer isOpen={Boolean(info?.text)}>
                    <div
                        className={`${className} group-hover:flex hidden absolute top-[130%] bg-neutral-700 border border-neutral-600 rounded-md px-3 p-1 z-50 h-max ${isRight ? "right-0 " : "left-0"}`}>
                        <span className='text-start text-xs'>{info?.text}</span>
                    </div>
                </ConditionalRenderer>
            </div>
        </div>
    )
}

function InfoDescription({children, text, className, isRight = false, width = 1000}: Readonly<{
    children: ReactNode,
    text: string,
    className?: string,
    isRight?: boolean,
    width?: number
}>) {



    return (
        <div className={`group/description relative ${className}`}>
            {children}
            <div className={`group-hover/description:flex hidden absolute top-full ${isRight ? "left-0" : "right-0"} bg-neutral-900 p-2 my-2 rounded-md z-20`} style={{width: `${width}%`}}>
                <span className='text-neutral-400 text-xs text-start'>{text}</span>
            </div>
        </div>
    )
}

export {InfoBox, InfoDescription}
