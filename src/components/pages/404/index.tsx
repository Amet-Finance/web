import Styles from "./index.module.css"
import Link from "next/link";

export default function NotFound() {
    return <>
        <div className={Styles.container}>
            <h2>The Page was not found!</h2>
            <Link href="/">
                <button className={Styles.back}>Home</button>
            </Link>
        </div>
    </>
}