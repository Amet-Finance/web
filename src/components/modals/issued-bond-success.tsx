import CongratulationsSVG from "../../../public/svg/utils/congratulations";
import XmarkSVG from "../../../public/svg/utils/xmark";
import {IssueBondSuccessAdditional} from "@/components/modals/type";
import {BasicButton} from "@/components/utils/buttons";
import Link from "next/link";
import ModalStore from "@/store/redux/modal";
import {useModal} from "@/modules/utils/modal";

export default function IssuedBondSuccess() {

    const {modalState} = useModal()

    const additional: IssueBondSuccessAdditional = modalState.additional as any;

    const decoded = additional?.decoded

    const issuedBondDetails = decoded?.find(item => item.name === "BondIssued")
    const chainId = additional.chainId

    const url = `/bonds/explore/${chainId}/${issuedBondDetails?.args?.bondAddress}`

    return (
        <div className='relative flex flex-col items-center rounded-4xl p-3 px-1 max-w-[500px] text-center z-20 gap-4'>
            <CongratulationsSVG/>
            <div className='absolute top-0 right-0'>
                <XmarkSVG onClick={ModalStore.closeModal} isMedium/>
            </div>
            <h1 className='text-2xl font-bold'>Congratulations</h1>
            <p className='text-sm text-neutral-400'>Your bond has been issued successfully! To enhance trust and attract
                purchasers, you can now deposit the payout if it is ready.</p>
            <Link href={url} onClick={ModalStore.closeModal}>
                <BasicButton>View Bond Details</BasicButton>
            </Link>
        </div>
    )
}
