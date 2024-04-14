import CongratulationsSVG from "../../../public/svg/utils/congratulations";
import XmarkSVG from "../../../public/svg/utils/xmark";
import ModalStore from "@/store/redux/modal";
import Link from "next/link";
import {BasicButton} from "@/components/utils/buttons";
import {generateReferralUrl} from "@/components/pages/bonds/pages/explore-bond-id/utils";
import {useAccount} from "wagmi";

export default function FirstTimePurchaseBond() {

    const {address} = useAccount();
    const referralUrl = generateReferralUrl(address as string);
    const hashtags = "AmetFinance,DeFi,Investment";
    const linkText = `I just made my first bond purchase on Amet Finance! Explore secure and innovative on-chain bonds like I did. Use my referral link to purchase: `
    const url = `https://x.com/intent/tweet?text=${linkText}&url=${referralUrl}&hashtags=${hashtags}`

    return (
        <div className='relative flex flex-col items-center rounded-4xl p-3 px-1 max-w-[500px] text-center z-20 gap-4'>
            <CongratulationsSVG/>
            <div className='absolute top-0 right-0'>
                <XmarkSVG onClick={ModalStore.closeModal} isMedium/>
            </div>
            <h1 className='text-2xl font-bold'>Congratulations on Your First Bond Purchase!</h1>
            <p className='text-sm text-neutral-400'>{`You've`} successfully purchased your first bond on Amet Finance!
                Welcome to a world of secure, transparent, and efficient bond trading. Your journey into innovative
                investment solutions starts now.</p>
            <Link href={url} onClick={ModalStore.closeModal} target="_blank">
                <BasicButton>Refer & Earn Rewards</BasicButton>
            </Link>
        </div>
    )
}
