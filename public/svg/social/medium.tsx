import Link from "next/link";
import {URLS} from "@/modules/utils/urls";

export default function MediumSVG({url}: { url: string }) {

    const title = url === URLS.Medium ? "Amet Finance Medium" : "";

    return (
        <Link href={url} target="_blank" rel="noreferrer" title={title}>
            <svg width="26" height="26" viewBox="0 0 32 32" fill="none" className='cursor-pointer hover:fill-white'
                 xmlns="http://www.w3.org/2000/svg">
                <path
                    className='firstOne'
                    d="M16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z"
                    fill="#7D7D7D"/>
                <path
                    d="M17.5573 16C17.5573 19.8129 14.4874 22.9038 10.7005 22.9038C6.91362 22.9038 3.84375 19.8129 3.84375 16C3.84375 12.1871 6.91363 9.09619 10.7006 9.09619C14.4874 9.09619 17.5573 12.1871 17.5573 16Z"
                    fill="black"/>
                <path
                    d="M25.0794 16C25.0794 19.5892 23.5445 22.4987 21.651 22.4987C19.7576 22.4987 18.2227 19.5892 18.2227 16C18.2227 12.4108 19.7576 9.50122 21.651 9.50122C23.5445 9.50122 25.0794 12.4108 25.0794 16Z"
                    fill="black"/>
                <path
                    d="M28.1563 16C28.1563 19.2157 27.6164 21.8226 26.9504 21.8226C26.2845 21.8226 25.7447 19.2157 25.7447 16C25.7447 12.7842 26.2844 10.1774 26.9504 10.1774C27.6164 10.1774 28.1563 12.7842 28.1563 16Z"
                    fill="black"/>
            </svg>
        </Link>

    )
}
