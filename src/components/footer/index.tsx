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

export default function Footer() {
    return <>
        <footer className="flex flex-col items-center z-20 bg-black">
            <div className='w-full h-px bg-b2'/>
            <div
                className="flex md:flex-row sm:flex-col md:items-start sm:items-center gap-8 justify-between md:py-10 md:px-24 sm:py-10 sm:px-8 w-full">
                <div className='flex flex-col md:items-start sm:items-center gap-2'>
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
                    <span className='text-g2 md:flex sm:hidden'>&#169; 2023 Amet Finance. All rights reserved.</span>
                </div>
                <Links/>
                <span className="text-g2 text-center whitespace-nowrap md:hidden sm:flex">&#169; 2023 Amet Finance. All rights reserved.</span>
            </div>
        </footer>
    </>
}

function Links() {

    const links = [
        {
            title: "About Us",
            attributes: [
                {title: 'Terms Of Service', url: URLS.TermsOfService},
                {title: 'Privacy Policy', url: URLS.PrivacyPolicy},
                {title: 'Brand Assets', url: URLS.BrandAssets},
                {title: 'DefiLlama', url: URLS.DefiLlama},
            ]
        },
        {
            title: "Get Help",
            attributes: [
                {title: 'Status', url: URLS.StatusPage},
                {title: 'Contact Us', url: URLS.ContactUs},
                {title: 'FAQ', url: URLS.FAQ},
            ]
        }
    ]

    function LinkComponent({item}: any) {
        return <>
            <div className='flex flex-col gap-4' key={item.title}>
                <span>{item.title}</span>
                <div className='flex flex-col gap-1'>
                    {item.attributes.map((attribute: any, index: number) => <Attribute info={attribute} key={index}/>)}
                </div>
            </div>
        </>
    }


    return <>
        <div className='flex gap-8'>
            {links.map(item => <LinkComponent item={item} key={item.title}/>)}
        </div>
    </>
}

function Attribute({info}: any) {
    const {title, url} = info;
    return <>
        <Link href={url} target="_blank" rel='noreferrer'>
            <button className="text-g2 cursor-pointer hover:text-white text-start">{title}</button>
        </Link>
    </>
}
