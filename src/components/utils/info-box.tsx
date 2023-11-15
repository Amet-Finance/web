import Link from "next/link";
import {URLS} from "@/modules/utils/urls";
import {useState} from "react";
import fa from "@walletconnect/legacy-modal/dist/cjs/browser/languages/fa";
import InfoSVG from "../../../public/svg/info";

type InfoData = {
    text: string;
    link?: string;
    isBlank?: boolean;
}

export default function InfoBox({children, info, className}: { children: any, info: InfoData, className?: string }) {

    const [showElement, setVisibility] = useState(false)
    const isBlank = info.isBlank || !info.link;

    const url = info.link || URLS.FAQ;
    const target = isBlank ? "_blank" : "_self";

    const changeVisibility = () => {
        setVisibility(!showElement);
        setTimeout(() => setVisibility(false), 1000)
    }

    return <>
        <div className={`relative flex items-center gap-1 w-full ${className}`}>
            {children}
            <div className='group'>
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
                {
                    (Boolean(info?.text)) && <>
                        {/*<Link href={url} target={target} title='Click to learn more!'>*/}
                            <div
                                className='group-hover:flex hidden absolute top-[130%] bg-neutral-700 left-0 border border-w1 rounded px-3 p-1 secondarySelector z-50 w-full h-max'>
                                <span className='text-sm font-medium'>{info?.text}</span>
                            </div>
                        {/*</Link>*/}
                    </>
                }
            </div>

        </div>
    </>
}
