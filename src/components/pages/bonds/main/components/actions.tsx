import Styles from "@/components/pages/bonds/main/components/index.module.css";
import Link from "next/link";

export default function Actions() {
    const texts = {
        headline: "Unlock Financial Possibilities with On-Chain Bonds",
        secondary: "Amet Finance's on-chain bonds platform lets you issue, buy, sell, and redeem bonds seamlessly. Elevate your investment strategy and embrace the future of decentralized finance today."
    }

    return <>
        <div className={Styles.actions}>
            <div className={Styles.texts}>
                <h1>{texts.headline}</h1>
                <p className={Styles.secondary}>{texts.secondary}</p>
            </div>
            <div className={Styles.actionContainer}>
                <Link href="/bonds/issue">
                    <button className={Styles.issue}>Issue bonds</button>
                </Link>
                <Link href="/bonds/explore">
                    <button className={Styles.explore}>Explore bonds</button>
                </Link>
            </div>
        </div>
    </>
}