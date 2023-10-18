import Styles from './index.module.css';
import TwitterSVG from "../../../public/svg/social/twitter";
import DiscordSVG from "../../../public/svg/social/discord";
import RedditSVG from "../../../public/svg/social/reddit";
import TelegramSVG from "../../../public/svg/social/telegram";
import AmetLogo from "../../../public/svg/amet-logo";
import Link from "next/link";
import {URLS} from "@/modules/utils/urls";
import LinkedInSVG from "../../../public/svg/social/linkedin";

export default function Footer() {
    return <>
        <footer className={Styles.container}>
            <div className={Styles.border}/>
            <div className={Styles.sections}>
                <div className={Styles.mainSection}>
                    <AmetLogo/>
                    <span className={Styles.secondaryText}>Managed by Amet Finance</span>
                    <div className={Styles.socials}>
                        <TwitterSVG/>
                        <DiscordSVG/>
                        <TelegramSVG/>
                        <RedditSVG/>
                        <LinkedInSVG/>
                    </div>
                    <span className={Styles.desktop}>&#169;2023 Amet Finance. All rights reserved.</span>
                </div>
                <Links/>
                <span className={Styles.mobile}>&#169;2023 Amet Finance. All rights reserved.</span>
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
            ]
        },
        {
            title: "Get Help",
            attributes: [
                {title: 'Contact Us', url: 'mailto:hello@amet.finance'},
                {title: 'FAQ', url: URLS.FAQ},
            ]
        }
    ]

    function LinkComponent({item}: any) {
        return <>
            <div className={Styles.link} key={item.title}>
                <span>{item.title}</span>
                <div className={Styles.attributes}>
                    {item.attributes.map((attribute: any, index: number) => <Attribute info={attribute} key={index}/>)}
                </div>
            </div>
        </>
    }


    return <>
        <div className={Styles.links}>
            {links.map(item => <LinkComponent item={item} key={item.title}/>)}
        </div>
    </>
}

function Attribute({info}: any) {
    const {title, url} = info;
    return <>
        <Link href={url} target="_blank" rel='noreferrer'>
            <span className="text-g2">{title}</span>
        </Link>
    </>
}