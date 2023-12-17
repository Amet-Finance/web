import {useSelector} from "react-redux";
import Link from "next/link";
import {RootState} from "@/store/redux/type";
import CongratulationsSVG from "../../../public/svg/congratulations";
import XmarkSVG from "../../../public/svg/xmark";
import {closeModal} from "@/store/redux/modal";
import {getChain} from "@/modules/utils/wallet-connect";

export default function IssuedBondSuccessModal() {
    const generalState = useSelector((item: RootState) => item.general);
    const chain = getChain(generalState.chainId);
    const modalState = useSelector((item: RootState) => item.modal)


    const additional = modalState.additional;

    const bondInfo = additional?.bondInfo
    const transaction = additional?.transaction;
    const decoded = additional?.decoded

    const url = `/bonds/explore/${chain?.id}/${decoded?.contractAddress}`

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
