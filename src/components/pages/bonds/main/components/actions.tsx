import Styles from "@/components/pages/bonds/main/components/index.module.css";
import Link from "next/link";

export default function Actions() {
    return <>
        <div className={Styles.actions}>
            <div className={Styles.texts}>
                <h1>Welcome to the on-chain Bonds</h1>
                <p>Buy, Sell, issue and redeem on-chain bonds with Amet Finance.</p>
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