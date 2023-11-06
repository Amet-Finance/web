import Link from "next/link";
import {URLS} from "@/modules/utils/urls";

type InfoData = {
    text: string;
    link?: string;
    isBlank?: boolean;
}

export default function InfoBox({children, info}: { children: any, info: InfoData }) {

    const url = info.link || URLS.FAQ;
    const isBlank = info.isBlank || !info.link
    const target = isBlank ? "_blank" : "_self"

    return <>
        <div className='relative cursor-help main w-full'>
            {children}
            {
                Boolean(info?.text) && <>
                    <Link href={url} target={target} title='Click to learn more!'>
                        <div
                            className='absolute top-full bg-gray-700  border rounded border-w1 px-3 p-1 secondarySelector z-50 w-full'>
                            <span className='text-sm font-medium'>{info?.text}</span>
                        </div>
                    </Link>
                </>
            }
        </div>
        <style jsx>{`
          .main:hover .secondarySelector {
            display: flex;
          }

          .secondarySelector {
            display: none;
          }
        `}</style>
    </>
}
