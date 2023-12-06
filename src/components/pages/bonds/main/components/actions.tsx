import Styles from "@/components/pages/bonds/main/components/index.module.css";
import Link from "next/link";
import {join} from "@/modules/utils/styles";

export default function Actions() {
    const texts = {
        secondary: "Amet Finance's on-chain bonds platform lets you issue, buy, sell, and redeem bonds seamlessly. Elevate your investment strategy and embrace the future of decentralized finance today."
    }

    return <>
        <div className={Styles.container}>
            <div className={Styles.actions}>
                <h1 className={join([Styles.headline, "font-bold"])}>
                    Unlock Financial <span
                    className="bg-white text-black text-center px-1">Possibilities</span><br/> with On-Chain Bonds</h1>
                <div className={Styles.line}/>
                <p className={Styles.gray1}>{texts.secondary}</p>
                <div className='flex items-stretch gap-6 md:flex-row sm:flex-col md:w-auto sm:w-full px-10'>
                    <Link href="/bonds/issue" className='w-full whitespace-nowrap'>
                        <button className={join([Styles.btn, Styles.issue])}>Issue bonds</button>
                    </Link>
                    <Link href="/bonds/explore" className='w-full whitespace-nowrap'>
                        <button className={join([Styles.btn, Styles.explore])}>Explore bonds</button>
                    </Link>
                </div>
            </div>
        </div>
    </>
}
