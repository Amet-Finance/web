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
                {title: 'Terms Of Service', url: 'https://docs.amet.finance/v1/additional-materials/terms-of-service'},
                {title: 'Privacy Policy', url: 'https://docs.amet.finance/v1/additional-materials/privacy-policy'},
            ]
        },
        {
            title: "Get Help",
            attributes: [
                {title: 'Contact Us', url: 'mailto:hello@amet.finance'},
                {title: 'FAQ', url: 'https://docs.amet.finance/v1/frequently-asked-questions-faqs'},
            ]
        }
    ]

    return <>
        <div className={Styles.links}>
            {links.map(item => {
                return <>
                    <div className={Styles.link} key={item.title}>
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