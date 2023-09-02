import Styles from './index.module.css';
import TwitterSVG from "../../../public/svg/twitter";
import DiscordSVG from "../../../public/svg/discord";
import RedditSVG from "../../../public/svg/reddit";
import TelegramSVG from "../../../public/svg/telegram";
export default function Footer(){
    return <>
        <footer className={Styles.container}>
            <div className={Styles.socials}>
                <TwitterSVG/>
                <DiscordSVG/>
                <TelegramSVG/>
                <RedditSVG/>
            </div>
            <span>Amet Finance &#169; 2023. All Rights Reserved</span>
        </footer>
    </>
}