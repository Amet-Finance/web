import {useRouter} from "next/router";
import {useSignature} from "@/modules/utils/transaction";
import XpAPI from "@/modules/api/xp";
import {GeneralContainer} from "@/components/utils/container";
import {BasicButton} from "@/components/utils/buttons";
import Image from "next/image";
import makeBlockie from "ethereum-blockies-base64";
import React from "react";
import {ScreenTypes} from "@/components/pages/token/xp-rewards/constants";

export default function XpRewardsLending({setScreen}: Readonly<{ setScreen: any }>) {
    const {query} = useRouter()

    const preMessage = `By signing this message, you confirm your participation in the Amet XP Rewards System.\nThis system rewards your engagement with Experience Points (XP), which can be used to unlock exclusive benefits on our platform.\n`;
    const {address, message, submitSignature} = useSignature(preMessage, true);

    async function activateXPAccount() {
        const signature = await submitSignature();
        if (!signature || !address) return;

        const params: any = {
            address,
            signature,
            message,
        }

        if (query.ref) {
            params.ref = query.ref
        }

        const response = await XpAPI.activateAccount(params);
        if (response.success) {
            setScreen(ScreenTypes.Xp)
        }


    }

    const randomAddresses = [
        "0x038db6c62d0f072616e2b8db7d3d7cfc829f7f65",
        "0x08a4e866425b4ed4ea8af9c5eb2e5eab21b3078a",
        "0x44c4503c34079759100191d2a36b2ebb38892c48"
    ]

    return (
        <GeneralContainer className='relative flex items-center justify-between py-28 gap-4'>
            <div className='flex flex-col gap-16 max-w-2xl z-10'>
                <div className='flex flex-col gap-6 md:text-start text-center'>
                    <h1 className='text-5xl font-bold'>{`Rewards Hub: Unlock Your Potential with Amet Finance`}</h1>
                    <p className='text-sm text-neutral-400'>Welcome to the Rewards Hub, your gateway to making the most
                        out of your engagement with Amet Finance. Here, every action not only brings you closer to
                        financial expertise but also rewards you with valuable XP. Engage in activities ranging from
                        bond purchases to content creation, and track your progress as you climb the ranks of our
                        community. Unlock exclusive rewards, gain access to special events, and leverage your XP to
                        enhance your financial journey.</p>
                </div>
                <div className='flex sm:flex-row flex-col-reverse sm:justify-start justify-center items-center gap-4'>
                    <BasicButton wMin onClick={activateXPAccount}>Activate Account</BasicButton>
                    <div className='flex items-center gap-2'>
                        <span className='text-xs text-neutral-600'>500+ participants</span>
                        <div className='relative flex items-center'>
                            <Image src={makeBlockie(randomAddresses[0])} alt={""} width={30} height={30}
                                   className='rounded-full border border-neutral-600'/>
                            <Image src={makeBlockie(randomAddresses[1])} alt={""} width={30} height={30}
                                   className='rounded-full border border-neutral-600 -translate-x-3'/>
                            <Image src={makeBlockie(randomAddresses[2])} alt={""} width={30} height={30}
                                   className='rounded-full border border-neutral-600 -translate-x-6'/>
                        </div>
                    </div>
                </div>
            </div>
            <Image src='/pngs/coin.png' alt="Coins Dropping from top on Amet Finance"
                   width={300} height={817}
                   className='object-cover rounded-xl md:flex hidden'/>
        </GeneralContainer>
    )

}
