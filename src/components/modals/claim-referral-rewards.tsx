import CongratulationsSVG from "../../../public/svg/utils/congratulations";
import XmarkSVG from "../../../public/svg/utils/xmark";
import ModalStore from "@/store/redux/modal";
import {BasicButton} from "@/components/utils/buttons";
import {URLS} from "@/modules/utils/urls";
import Link from "next/link";
import {formatLargeNumber} from "@/modules/utils/numbers";
import {useModal} from "@/modules/utils/modal";

export default function ClaimReferralRewards() {
    const {modalState, isClosed} = useModal()
    const {totalReward, symbol} = modalState.additional as {address: string, totalReward: number, symbol: string};

    const rewardFormatted = formatLargeNumber(totalReward);
    const linkText = `Just made ${rewardFormatted} ${symbol} with Amet Finance! Check it out and start earning too.`
    const hashtags = `AmetFinance,EarnCrypto`
    const link = `https://x.com/intent/tweet?text=${linkText}&url=${URLS.BaseUrl}&hashtags=${hashtags}`

    return <div className='relative flex flex-col items-center rounded-4xl  max-w-[500px] text-center z-20 gap-6'>
        <CongratulationsSVG/>
        <div className='absolute top-0 right-0'>
            <XmarkSVG onClick={ModalStore.closeModal} isMedium/>
        </div>
        <h1 className='text-2xl font-bold'>Congratulations</h1>
        <p className='text-start'>You have made <span
            className='text-3xl font-bold text-green-500'>{rewardFormatted} {symbol || "USDT"}</span> with
            Amet Finance.
        </p>
        <Link href={link} target="_blank" className='w-full'>
            <BasicButton>
                <span>Share on Twitter</span>
            </BasicButton>
        </Link>
    </div>
}
