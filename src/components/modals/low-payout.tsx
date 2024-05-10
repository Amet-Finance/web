import WarningSVG from "../../../public/svg/utils/warning";
import {BasicButton} from "@/components/utils/buttons";
import ModalStore from "@/store/redux/modal";

export default function LowPayout() {
    return (
        <div className='flex flex-col items-center gap-8 max-w-md'>
            <WarningSVG size={124}/>
            <div className='flex flex-col items-center gap-4'>
                <h1 className='text-2xl font-medium'>Caution: Low Secured Percentage</h1>
                <p className='text-xs text-neutral-600'>Please be aware that this bond currently has a low secured
                    percentage, which increases the risk of not receiving the expected payout. This situation arises
                    when the issuer has not deposited sufficient
                    funds
                    to cover the bond payout. It is important to review this investment carefully and understand the
                    associated risks before proceeding.</p>
            </div>
            <BasicButton onClick={ModalStore.closeModal}>
                Proceed to Bond
            </BasicButton>
        </div>
    )
}
