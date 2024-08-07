import Link from "next/link";
import {URLS} from "@/modules/utils/urls";

export default function TelegramSVG({url}: {url: string}) {
    const title = url === URLS.Telegram ? "Amet Finance Telegram" : "";

    return (
        <>
            <Link href={url} target="_blank" rel="noreferrer" title={title} className='cursor-pointer hover:fill-white'>
                <svg width="26" height="26" viewBox="0 0 32 33" fill="none" xmlns="http://www.w3.org/2000/svg"
                     className='hover'>
                    <path
                        d="M16 32.041C24.8387 32.041 32 24.8797 32 16.041C32 7.20235 24.8387 0.0410156 16 0.0410156C7.16133 0.0410156 0 7.20235 0 16.041C0 24.8797 7.16133 32.041 16 32.041ZM7.32133 15.6943L22.748 9.74635C23.464 9.48768 24.0893 9.92102 23.8573 11.0037L23.8587 11.0023L21.232 23.377C21.0373 24.2544 20.516 24.4677 19.7867 24.0543L15.7867 21.1063L13.8573 22.965C13.644 23.1784 13.464 23.3584 13.0507 23.3584L13.3347 19.2877L20.748 12.5903C21.0707 12.3063 20.676 12.1463 20.2507 12.429L11.0893 18.197L7.14 16.965C6.28267 16.693 6.264 16.1077 7.32133 15.6943Z"
                        fill="#7D7D7D"/>
                </svg>
            </Link>
            <style jsx>{`
                path {
                    fill: #7D7D7D;
                }

                svg:hover path {
                    fill: #fff;
                }
            `}</style>
        </>
    )
}
