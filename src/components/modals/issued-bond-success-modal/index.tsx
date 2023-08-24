import {useSelector} from "react-redux";
import Styles from "./index.module.css"
import Link from "next/link";

export default function IssuedBondSuccessModal() {
    const modalState = useSelector((item: any) => item.modal)
    const additional = modalState.additional;

    const url = `/bonds/explore/${additional.decoded.contractAddress}`

    return <>
        <div className={Styles.container}>
            <h1>Congratulations</h1>
            <p>Your bonds were successfully issued. Visit and see the live version of <Link href={url} target="_blank"><span className={Styles.link}>your bonds page.</span></Link></p>
        </div>
    </>
}