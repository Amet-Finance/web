import {useSelector} from "react-redux";
import Link from "next/link";
import {RootState} from "@/store/redux/type";
import CongratulationsSVG from "../../../public/svg/congratulations";
import XmarkSVG from "../../../public/svg/xmark";
import {closeModal} from "@/store/redux/modal";
import {getChain} from "@/modules/utils/wallet-connect";
import {IssueBondSuccessAdditional} from "@/components/modals/type";

export default function IssuedBondSuccessModal() {

    const modalState = useSelector((item: RootState) => item.modal)

    const additional: IssueBondSuccessAdditional = modalState.additional as any;

    const decoded = additional?.decoded
    const chainId = additional.chainId

    const url = `/bonds/explore/${chainId}/${decoded?.bondAddress}`

    return <>
        <div className='relative flex flex-col items-center rounded-4xl p-3 px-1 max-w-[500px] text-center z-20 gap-4'>
            <CongratulationsSVG/>
            <div className='absolute top-0 right-0'>
                <XmarkSVG onClick={closeModal} isMedium/>
            </div>
            <h1 className='text-2xl font-bold'>Congratulations</h1>
            <p>Your bonds were successfully issued. Visit and see the live version of
                <Link href={url} target="_blank">
                    <span className='text-green-500'> your bonds page.</span>
                </Link>
            </p>
        </div>
    </>
}
