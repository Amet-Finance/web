import {useSelector} from "react-redux";
import Styles from "./index.module.css"
import Link from "next/link";
import {RootState} from "@/store/redux/type";

export default function IssuedBondSuccessModal() {
    const modalState = useSelector((item: RootState) => item.modal)
    const additional = modalState.additional;

    const bondInfo = additional?.bondInfo
    const transaction = additional?.transaction;
    const decoded = additional?.decoded

    const url = `/bonds/explore/${decoded?.contractAddress}`

    return <>
        <div className={Styles.container}>
            <h1>Congratulations</h1>
            <p>Your bonds were successfully issued. Visit and see the live version of
                <Link href={url} target="_blank">
                    <span className={Styles.link}> your bonds page.</span>
                </Link>
            </p>
        </div>
    </>
}