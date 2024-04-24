import {GeneralContainer, ToggleBetweenChildren} from "@/components/utils/container";
import {BasicButton} from "@/components/utils/buttons";
import {useSignature} from "@/modules/utils/transaction";
import XpAPI from "@/modules/api/xp";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {useAccountExtended} from "@/modules/utils/address";
import Link from "next/link";

const ScreenTypes = {
    Activate: "activate",
    Xp: 'xp'
}

export default function XpRewards() {
    const {active} = useAccountExtended()
    const [screen, setScreen] = useState(ScreenTypes.Activate);

    useEffect(() => {
        if (active) setScreen(ScreenTypes.Xp)
    }, [active])

    switch (screen) {
        case ScreenTypes.Activate:
            return <ActivateScreen setScreen={setScreen}/>
        case ScreenTypes.Xp:
            return <XpScreen/>
    }
}

function XpScreen() {
    const {twitter, discord, xp, isConnected, address, open} = useAccountExtended();

    function connectTwitter() {
        const clientId = process.env.TWITTER_CLIENT_ID || "d295SDkyRFFPWV9mZDZMUV95RDg6MTpjaQ";
        const redirectUri = 'https://api.amet.finance/validate/twitter'

        const width = 600, height = 800;
        const left = (window.innerWidth - width) / 2;
        const top = (window.innerHeight - height) / 2;

        if (!isConnected) return open();

        const url = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=tweet.read%20users.read%20offline.access%20follows.read%20follows.write&state=${address}&code_challenge=challenge&code_challenge_method=plain`
        window.open(url, "TwitterAuthPopup", `popup=true,width=${width},height=${height},left=${left},top=${top}`)
    }

    function connectDiscord() {

        const clientId = "1232655689386692689"

        const redirectUri = 'https://api.amet.finance/validate/discord'

        const width = 600, height = 800;
        const left = (window.innerWidth - width) / 2;
        const top = (window.innerHeight - height) / 2;

        if (!isConnected) return open();

        const url = `https://discord.com/oauth2/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=identify+guilds.join+guilds+guilds.members.read&state=${address}&prompt=consent&integration_type=0`
        window.open(url, "DiscordAuthPopup", `popup=true,width=${width},height=${height},left=${left},top=${top}`)
    }

    return (
        <GeneralContainer className='flex flex-col items-center py-64 gap-12'>
            <div className='flex justify-between w-full'>
                <div className='flex flex-col items-center'>
                    <span className='text-2xl font-bold'>{xp || 0}</span>
                    <span className='text-sm text-neutral-600'>Your XP</span>
                </div>
                <button className='bg-green-500 hover:bg-green-600 px-8  rounded-3xl'>Refer and earn!</button>
            </div>

            <div className='flex justify-between w-full'>
                <div className='flex flex-col gap-4'>
                    <span className='text-3xl'>Social Activities</span>
                    <ToggleBetweenChildren isOpen={!Boolean(twitter)}>
                        <BasicButton wMin onClick={connectTwitter}>Connect your X</BasicButton>
                        <p>Twitter: <Link href={`https://x.com/${twitter}`}
                                             target="_blank"><u>{twitter}</u></Link></p>
                    </ToggleBetweenChildren>
                    <ToggleBetweenChildren isOpen={!Boolean(discord)}>
                        <BasicButton wMin onClick={connectDiscord}>Join Amet Discord</BasicButton>
                        <p>Discord: <Link href={`https://discord.com/users/${discord}`} target="_blank"><u>{discord}</u></Link></p>
                    </ToggleBetweenChildren>
                </div>
                <div className='flex flex-col items-center gap-4'>
                    <span className='text-3xl'>Social Activities</span>

                </div>
            </div>
        </GeneralContainer>
    )
}


function ActivateScreen({setScreen}: { setScreen: any }) {
    const {query} = useRouter()


    const preMessage = `By signing this message, you confirm your participation in the Amet XP Rewards System.\nThis system rewards your engagement with Experience Points (XP), which can be used to unlock exclusive benefits on our platform.\n`;
    const {address, message, submitSignature} = useSignature(preMessage, true);


    async function activateXPAccount() {
        const signature = await submitSignature();
        if (!signature || !address) return;

        const params = {
            address,
            signature,
            message,
            ref: query.ref
        }

        const response = await XpAPI.activateAccount(params);
        if (response.success) {
            setScreen(ScreenTypes.Xp)
        }


    }

    return (
        <GeneralContainer className='flex flex-col py-64 gap-4'>
            <div className='flex flex-col gap-8 max-w-2xl'>
                <div className='flex flex-col gap-4'>
                    <h1 className='text-5xl font-bold'>Welcome to the Amet XP Rewards System</h1>
                    <p className='text-sm text-neutral-400'>Dive into the Amet XP Rewards System, where your engagement
                        and
                        activity directly translate into rewards. This system is designed to enrich your experience on
                        our
                        platform by recognizing and rewarding your actions. From issuing and purchasing bonds to
                        engaging
                        with our community, every interaction earns you Experience Points (XP) that unlock exclusive
                        perks
                        and benefits.</p>
                </div>
                <BasicButton wMin onClick={activateXPAccount}>Activate Your XP Account</BasicButton>
            </div>
        </GeneralContainer>
    )
}
