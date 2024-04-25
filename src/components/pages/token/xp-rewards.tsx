import {GeneralContainer, ToggleBetweenChildren} from "@/components/utils/container";
import {BasicButton} from "@/components/utils/buttons";
import {useSignature} from "@/modules/utils/transaction";
import XpAPI from "@/modules/api/xp";
import {useRouter} from "next/router";
import React, {ReactNode, useEffect, useState} from "react";
import {useAccountExtended} from "@/modules/utils/address";
import Link from "next/link";
import {getExplorer, shorten} from "@/modules/web3/util";
import {defaultChain} from "@/modules/utils/wallet-connect";

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
    const {_id, twitter, discord, xp, isConnected, address, open} = useAccountExtended();

    // todo after success connect
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
        <GeneralContainer className='grid grid-cols-12 py-32 gap-4' isPadding>
            <div
                className='col-span-6 flex flex-col justify-between bg-neutral-900 rounded-3xl p-4 cursor-pointer h-56'>
                <div className='flex justify-between w-full'>
                    <span className='text-xs text-neutral-600'>Updated 3h. ago</span>
                    <span className='text-xs text-neutral-600'>Share</span>
                </div>
                <div className='flex flex-col justify-center items-center w-full'>
                    <span className='text-7xl font-bold'>{xp}</span>
                    <span className='text-sm text-neutral-400'>Your Experience Points(XP)</span>
                </div>
                <div/>
            </div>
            <div className='col-span-3 w-full'>
                <Action
                    title="Join XP System"
                    description="Click the join button and sign with your wallet to start earning XP."
                    value="50"
                    result={(<div className='flex items-center gap-2 text-sm text-neutral-400'>
                        <span>Address:</span>
                        <Link href={getExplorer(defaultChain.id, "address", _id)} target="_blank">
                            <u className='text-white'>{shorten(_id, 5)}</u>
                        </Link>
                    </div>)}
                    isFinished={Boolean(_id)}
                />
            </div>
            <div className='col-span-3 w-full'>
                <Action
                    title="Follow Amet on Twitter"
                    description="Follow us on Twitter to stay updated with the latest news and announcements."
                    value="50"
                    result={(
                        <ToggleBetweenChildren isOpen={Boolean(twitter?.id)}>
                            <div className='flex items-center gap-2 text-sm text-neutral-400'>
                                <span>Connected:</span>
                                <Link href={`https://x.com/${twitter?.username}`} target="_blank" className='text-white'>
                                    <span className='underline underline-offset-4'>{twitter?.username}</span>
                                </Link>
                            </div>
                            <button onClick={connectTwitter} className='px-4 py-1 bg-neutral-700 rounded-3xl hover:bg-neutral-600'>Connect</button>
                        </ToggleBetweenChildren>
                    )}
                    isFinished={Boolean(twitter)}
                />
            </div>
            <div className='col-span-3 w-full h-56'>
                <Action
                    title="Join Amet's Discord"
                    description="Join our Discord community to engage with other users and access exclusive content."
                    value="50"
                    result={(
                        <ToggleBetweenChildren isOpen={Boolean(discord?.id)}>
                            <div className='flex items-center gap-2 text-sm text-neutral-400'>
                                <span>Connected:</span>
                                <Link href={`https://discord.com/users/${discord?.id}`} target="_blank"
                                      className='text-white'>
                                    <span className='underline underline-offset-4'>{discord?.username}</span>
                                </Link>
                            </div>
                            <button onClick={connectDiscord}
                                    className='px-4 py-1 bg-neutral-700 rounded-3xl hover:bg-neutral-600'>Connect
                            </button>
                        </ToggleBetweenChildren>
                    )}
                    isFinished={Boolean(discord)}
                />
            </div>


        </GeneralContainer>
    )
}

function Action({title, description, value, result, isFinished}: {
    title: string,
    description: string,
    value: string,
    isFinished: boolean
    result?: ReactNode
}) {
    return (
        <div
            className={`relative flex flex-col justify-around items-center gap-4 w-full
                        h-full rounded-3xl bg-neutral-950 hover:bg-neutral-900
                        ${isFinished ? "cursor-not-allowed" : "cursor-pointer"} p-4
                        border border-neutral-900 hover:border-neutral-800
                        `}>
            <div className='absolute flex items-center justify-center bg-green-500 w-8 h-8 rounded-full top-3 right-3'>
                <span className='text-sm font-bold'>{value}</span>
            </div>
            <span/>
            <div className='flex flex-col gap-2 items-center'>
                <span className='text-xl font-semibold'>{title}</span>
                <p className='text-xs text-center text-neutral-600'>{description}</p>
            </div>
            {result || <span/>}
        </div>
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
