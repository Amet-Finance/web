import Styles from './index.module.css'
import Link from "next/link";

export default function LearnMore() {
    // todo update here the url
    return <>
        <Link href="https://docs.amet.finance/v1/" target="_blank" className={Styles.learnMore}>
            <h3>Explore Deeper Insights about Bonds</h3>
        </Link>
    </>
}