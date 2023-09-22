import Styles from './index.module.css';
import TwitterSVG from "../../../public/svg/twitter";
import DiscordSVG from "../../../public/svg/discord";
import RedditSVG from "../../../public/svg/reddit";
import TelegramSVG from "../../../public/svg/telegram";
import AmetLogo from "../../../public/svg/amet-logo";
import Link from "next/link";

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
                    </div>
                    <span>&#169;2023 Amet Finance. All rights reserved.</span>
                </div>
                <Links/>
            </div>
        </footer>
    </>
}

function Links() {

    const links = [
        {
            title: "About Us",
            attributes: [
                {title: 'Terms of service', url: '/'},
                {title: 'Privacy policy', url: '/'},
            ]
        },
        {
            title: "Get Help",
            attributes: [
                {title: 'Contact Us', url: '/'},
                {title: 'Help Center', url: '/'},
            ]
        }
    ]

    return <>
        <div className={Styles.links}>
            {links.map(item => {
                return <>
                    <div className={Styles.link}>
                        <span>{item.title}</span>
                        <div className={Styles.attributes}>
                            {item.attributes.map((attribute, index) => <Attribute info={attribute} key={index}/>)}
                        </div>
                    </div>
                </>
            })}
        </div>
    </>
}

function Attribute({info}: any) {
    const {title, url} = info;
    return <>
        <Link href={url}>
            <span className={Styles.secondaryText}>{title}</span>
        </Link>
    </>
}