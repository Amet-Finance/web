import {useSelector} from "react-redux";
import Styles from "./index.module.css"
import Link from "next/link";
import {RootState} from "@/store/redux/type";
import CongratulationsSVG from "../../../../public/svg/congratulations";
import XmarkSVG from "../../../../public/svg/xmark";
import {closeModal} from "@/store/redux/modal";
import {useNetwork} from "wagmi";

export default function IssuedBondSuccessModal() {
    const {chain} = useNetwork()
    const modalState = useSelector((item: RootState) => item.modal)


    const additional = modalState.additional;

    const bondInfo = additional?.bondInfo
    const transaction = additional?.transaction;
    const decoded = additional?.decoded

    const url = `/bonds/explore/${decoded?.contractAddress}?chainId=${"0x" + chain?.id.toString(16)}`

    return <>
        <div className={Styles.container}>
            <CongratulationsSVG/>
            <div className={Styles.xmark}>
                <XmarkSVG onClick={closeModal} isMedium/>
            </div>
            <h1>Congratulations</h1>
            <p>Your bonds were successfully issued. Visit and see the live version of&nbsp;
                <Link href={url} target="_blank">
                    <span className={Styles.link}>your bonds page.</span>
                </Link>
            </p>
        </div>
    </>
}
