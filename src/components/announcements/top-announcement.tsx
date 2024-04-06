import XmarkSVG from "../../../public/svg/utils/xmark";
import {useEffect} from "react";
import Link from "next/link";
import {URLS} from "@/modules/utils/urls";
import {useShow} from "@/components/utils/container";

export default function TopAnnouncement() {

    const {isOpen, setIsOpen} = useShow();

    useEffect(() => {
        if (typeof window !== "undefined") {
            const isHidden = getConfig();
            setIsOpen(isHidden)
        }
    }, [])

    function getConfig() {
        const isHidden = localStorage.getItem("amet-finance-announcement")
        if (isHidden) {
            return JSON.parse(isHidden)
        }
        return false
    }

    function hide() {
        localStorage.setItem("amet-finance-announcement", JSON.stringify(true))
        setIsOpen(true);
    }

    if (isOpen) return null;

    return (
        <div className='flex justify-between items-center w-full py-2 bg-green-500 px-4 text-black'>
            <span/>
            <span>Exciting News: Amet Finance v2 is Live! Be a part of the journey – join our discussion on <Link
                href={URLS.Discord} className='font-semibold' target="_blank"><u>Discord now</u></Link>.</span>
            <div className='min-w-[1rem]'>
                <XmarkSVG isSmall color='#000' onClick={() => hide()}/>
            </div>
        </div>
    )
}
