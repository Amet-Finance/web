import Styles from "./index.module.css";
import Link from "next/link";

export default function Home() {
    return <>
        <main className={Styles.container}>
            <div className={Styles.texts}>
                <h1>Introduction:</h1>
                <p>
                    Welcome to Amet Finance, where decentralized finance meets innovation.
                    With Amet Finance, we are redefining the possibilities of DeFi,
                    putting the control and flexibility back into the hands of the users.
                </p>
            </div>
            <div className={Styles.boxes}>
                <Link href='/bonds'>
                    <div className={Styles.box}>
                        <div className={Styles.circle}/>
                        <span>On-chain Bonds</span>
                    </div>
                </Link>
                <div className={Styles.boxInactive}>
                    <div className={Styles.circle}/>
                    <span>&empty;&empty;&empty; &empty;&empty;&empty;&empty; &empty;&empty;&empty;</span>
                </div>
                <div className={Styles.boxInactive}>
                    <div className={Styles.circle}/>
                    <span>&sum;&sum;&sum;&sum; 	&sum;&sum;&sum;&sum;</span>
                </div>
            </div>
        </main>
    </>
}