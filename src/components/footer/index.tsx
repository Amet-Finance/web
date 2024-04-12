import TwitterSVG from "../../../public/svg/social/twitter";
import DiscordSVG from "../../../public/svg/social/discord";
import RedditSVG from "../../../public/svg/social/reddit";
import TelegramSVG from "../../../public/svg/social/telegram";
import AmetLogo from "../../../public/svg/amet-logo";
import Link from "next/link";
import {URLS} from "@/modules/utils/urls";
import LinkedInSVG from "../../../public/svg/social/linkedin";
import MediumSVG from "../../../public/svg/social/medium";
import GithubSVG from "../../../public/svg/social/github";
import FacebookSVG from "../../../public/svg/social/facebook";
import {GeneralContainer} from "@/components/utils/container";
import {FOOTER_LINKS} from "@/components/footer/constants";

export default function Footer() {
    return <>
        <footer className="flex flex-col items-center z-20 bg-black w-full">
            <div className='w-full h-px bg-b2'/>
            <GeneralContainer
                className="flex md:flex-row flex-col md:items-start items-center gap-8 justify-between py-10 w-full"
                isPadding>
                <div className='flex flex-col md:items-start items-center gap-2.5'>
                    <AmetLogo/>
                    <div className='flex gap-3.5 w-full'>
                        <TwitterSVG url={URLS.Twitter}/>
                        <DiscordSVG/>
                        <TelegramSVG url={URLS.Telegram}/>
                        <RedditSVG url={URLS.Reddit}/>
                        <LinkedInSVG/>
                        <MediumSVG url={URLS.Medium}/>
                        <GithubSVG url={URLS.Github}/>
                        <FacebookSVG url={URLS.Facebook}/>
                    </div>
                    <Disclaimer className='md:flex hidden'/>
                </div>
                <Links/>
                <Disclaimer className='md:hidden flex'/>
            </GeneralContainer>
            <GeneralContainer className='flex flex-col gap-0.5 pb-12'>
                <p className='text-mm text-neutral-600'><b>Disclaimer</b>: Amet Finance is an open-source and
                    permissionless
                    platform where anyone can issue, manage, and trade bonds. It is important to understand that all
                    activities conducted on the platform are at the {`user's`} discretion and risk. The content and
                    tools
                    provided by Amet Finance are for informational purposes only and should not be construed as
                    financial advice. We encourage all users to do their own research (DYOR) and consider their
                    financial situation and risk tolerance before engaging in bond issuance, management, or trading.
                    Amet Finance does not take responsibility for individual investment decisions, losses, or gains.</p>
            </GeneralContainer>
        </footer>
    </>
}

function Disclaimer({className}: { className: string }) {
    return (
        <p className={`text-neutral-600 text-xs text-center whitespace-nowrap ${className}`}>&#169; 2023 Amet Finance.
            All rights reserved.</p>)
}

function Links() {


    return (
        <div className='flex gap-8'>
            {FOOTER_LINKS.map(item => <LinkComponent item={item} key={item.title}/>)}
        </div>
    )
}


function LinkComponent({item}: any) {
    return (
        <div className='flex flex-col gap-4' key={item.title}>
            <span className='text-neutral-200'>{item.title}</span>
            <div className='flex flex-col gap-1'>
                {item.attributes.map((attribute: any, index: number) => <Attribute info={attribute} key={index}/>)}
            </div>
        </div>
    )
}


function Attribute({info}: any) {
    const {title, url} = info;
    return (
        <Link href={url} target="_blank" rel='noreferrer'>
            <button className="text-neutral-600 cursor-pointer hover:text-white text-start">{title}</button>
        </Link>
    )
}
