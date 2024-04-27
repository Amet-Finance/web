import {ConditionalRenderer, GeneralContainer, ToggleBetweenChildren} from "@/components/utils/container";
import {BasicButton} from "@/components/utils/buttons";
import {useSignature} from "@/modules/utils/transaction";
import XpAPI from "@/modules/api/xp";
import {useRouter} from "next/router";
import React, {ReactNode, useEffect, useState} from "react";
import {copyToClipboard, useAccountExtended} from "@/modules/utils/address";
import Link from "next/link";
import {shorten} from "@/modules/web3/util";
import Image from "next/image";
import makeBlockie from "ethereum-blockies-base64";
import InfinitySVG from "../../../../public/svg/utils/infinity";
import {hourInSec} from "@/modules/utils/dates";
import {formatLargeNumber} from "@/modules/utils/numbers";

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
    const {
        _id, twitter,
        discord, xp,
        code, active,
        isConnected, address,
        lastUpdated,
        open
    } = useAccountExtended();

    const [settings, setSettings] = useState({
        hideCompleted: false
    })


    const utcTimeInMs = new Date(new Date().toUTCString()).getTime()
    const updateHoursAgo = lastUpdated ? Math.floor((utcTimeInMs - new Date(lastUpdated).getTime()) / (hourInSec * 1000)) : "Invalid"


    const referralUrl = `${location.href}?ref=${code}`
    const addressUrl = `${location.href}/address/${address}`

    const showTwitter = !settings.hideCompleted || !twitter?.id;
    const showDiscord = !settings.hideCompleted || !discord?.id;


    function updateSettings(event: any) {

        setSettings({
            ...settings,
            [event.target.id]: event.target.checked
        })
    }

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
                className='col-span-12 flex flex-col justify-between bg-neutral-900 rounded-3xl p-4 gap-8 cursor-pointer'>
                <div className='flex justify-between w-full'>
                    <span className='text-xs text-neutral-600'>Updated {updateHoursAgo}h. ago</span>
                    <span className='text-xs text-neutral-600'>Share</span>
                </div>
                <div className='flex flex-col justify-center items-center w-full'>
                    <span className='text-7xl font-bold'>{formatLargeNumber(xp || 0)}</span>
                    <span className='text-sm text-neutral-400'>Your Experience Points(XP)</span>
                </div>
                <div className='flex items-center w-full'>
                    <button className='flex items-center gap-2 text-sm text-neutral-400 cursor-pointer'>
                        <input type="checkbox" id='hideCompleted' onChange={updateSettings} className='cursor-pointer'/>
                        <label htmlFor="hideCompleted" className='cursor-pointer'>Hide completed actions</label>
                    </button>
                </div>
            </div>

            <div className='col-span-12 flex items-center justify-center py-8'>
                <span className='text-2xl font-medium'>Basic Actions</span>
            </div>
            <ConditionalContainer isOpen={!settings.hideCompleted || !Boolean(active)}>
                <Action
                    title="Join XP System"
                    description="Click the join button and sign with your wallet to start earning XP."
                    value="50"
                    isFinished={Boolean(active)}
                    result={(<div className='flex items-center gap-2 text-sm text-neutral-400'>
                        <span>Address:</span>
                        <Link href={addressUrl} target="_blank">
                            <span className='underline underline-offset-4 text-white'>{shorten(_id, 5)}</span>
                        </Link>
                    </div>)}
                />
            </ConditionalContainer>
            <ConditionalContainer isOpen={true}>
                <Action
                    title="Refer a Friend"
                    description="Refer a friend using your unique code, and earn a percentage of their earned XP."
                    value="10%"
                    isInfinite={true}
                    isFinished={false}
                    result={(
                        <ActionButton onClick={copyToClipboard.bind(null, referralUrl, "Referral Url")}>
                            Copy Referral Url
                        </ActionButton>
                    )}
                />
            </ConditionalContainer>

            <ConditionalRenderer isOpen={showDiscord || showTwitter}>
                <div className='col-span-12 flex items-center justify-center py-8'>
                    <span className='text-2xl font-medium'>Social Actions</span>
                </div>
            </ConditionalRenderer>
            <ConditionalContainer isOpen={showTwitter}>
                <Action
                    title="Follow Amet on Twitter"
                    description="Follow us on Twitter to stay updated with the latest news and announcements."
                    value="50"
                    isFinished={Boolean(twitter)}
                    result={(
                        <ToggleBetweenChildren isOpen={Boolean(twitter?.id)}>
                            <div className='flex items-center gap-2 text-sm text-neutral-400'>
                                <span>Connected:</span>
                                <Link href={`https://x.com/${twitter?.username}`} target="_blank">
                                    <span className='text-white underline underline-offset-4'>{twitter?.username}</span>
                                </Link>
                            </div>
                            <ActionButton onClick={connectTwitter}>Connect</ActionButton>
                        </ToggleBetweenChildren>
                    )}
                />
            </ConditionalContainer>
            <ConditionalContainer isOpen={showDiscord}>
                <Action
                    title="Join Amet's Discord"
                    description="Join our Discord community to engage with other users and access exclusive content."
                    value="50"
                    isFinished={Boolean(discord)}
                    result={(
                        <ToggleBetweenChildren isOpen={Boolean(discord?.id)}>
                            <div className='flex items-center gap-2 text-sm text-neutral-400'>
                                <span>Connected:</span>
                                <Link href={`https://discord.com/users/${discord?.id}`} target="_blank">
                                    <span className='text-white underline underline-offset-4'>{discord?.username}</span>
                                </Link>
                            </div>
                            <ActionButton onClick={connectDiscord}>Connect</ActionButton>
                        </ToggleBetweenChildren>
                    )}
                />
            </ConditionalContainer>


            <div className='col-span-12 flex items-center justify-center py-8'>
                <span className='text-2xl font-medium'>Issuer Actions</span>
            </div>
            <div className='col-span-3 w-full'>
                <Action
                    title="Issue Bonds"
                    description="Issue bonds on Amet Finance and contribute to our ecosystem's growth."
                    value="500"
                    isInfinite
                    result={(
                        <Link href='/bonds/issue' target='_blank'
                              className='rounded-3xl hover:bg-neutral-600'>
                            <ActionButton>Issue Bonds</ActionButton>
                        </Link>
                    )}
                    isFinished={false}
                />
            </div>
            <div className='col-span-3 w-full'>
                <Action
                    title="Complete Redemption"
                    description="Earn additional XP when all your issued bonds are redeemed. 8 XP per $1 value of redeemed."
                    value="8"
                    isInfinite
                    result={(
                        <Link href={`/address/${address}?tab=issued-bonds`} target='_blank'
                              className='rounded-3xl hover:bg-neutral-600'>
                            <ActionButton onClick={connectDiscord}>
                                My Issued Bonds
                            </ActionButton>
                        </Link>
                    )}
                    isFinished={false}
                />
            </div>
            <div className='col-span-3 w-full'>
                <Action
                    title="Settling Bond"
                    description="Settle bonds responsibly and secure your financial interactions."
                    value="20"
                    isInfinite
                    result={(
                        <Link href={`/address/${address}?tab=issued-bonds`} target='_blank'
                              className='rounded-3xl hover:bg-neutral-600'>
                            <ActionButton onClick={connectDiscord}>
                                My Issued Bonds
                            </ActionButton>
                        </Link>
                    )}
                    isFinished={false}
                />
            </div>


            <div className='col-span-12 flex items-center justify-center py-8'>
                <span className='text-2xl font-medium'>Bond Actions</span>
            </div>
            <div className='col-span-3 w-full'>
                <Action
                    title="Purchase Bonds"
                    description="Purchase any bond on the platform to invest in your future and earn XP on every $1 purchased."
                    value="6"
                    isInfinite
                    result={(
                        <Link href='/bonds/explore' target='_blank'
                              className='rounded-3xl hover:bg-neutral-600'>
                            <ActionButton onClick={connectDiscord}>
                                Explore Bonds
                            </ActionButton>
                        </Link>
                    )}
                    isFinished={false}
                />
            </div>
            <div className='col-span-3 w-full'>
                <Action
                    title="Purchase AMT Bonds"
                    description="Specifically purchase AMT bonds for higher rewards."
                    value="10"
                    isInfinite
                    result={(
                        // todo add exact url
                        <Link href='/bonds/explore' target='_blank'
                              className='rounded-3xl hover:bg-neutral-600'>
                            <ActionButton onClick={connectDiscord}>
                                Explore Bonds
                            </ActionButton>
                        </Link>
                    )}
                    isFinished={false}
                />
            </div>
            <div className='col-span-3 w-full'>
                <Action
                    title="Referr Users"
                    description="Refer new users to purchase bonds and earn 4 XP per $1 value of referral purchase."
                    value="4"
                    isInfinite
                    result={(
                        <Link href='/bonds/explore' target='_blank'
                              className='rounded-3xl hover:bg-neutral-600'>
                            <ActionButton onClick={connectDiscord}>
                                Explore Bonds
                            </ActionButton>
                        </Link>
                    )}
                    isFinished={false}
                />
            </div>


        </GeneralContainer>
    )
}

function Action({title, description, value, result, isInfinite, isFinished}: {
    title: string,
    description: string,
    value: string,
    isFinished: boolean
    isInfinite?: boolean
    result?: ReactNode
}) {
    return (
        <div
            className={`relative flex flex-col justify-between items-center gap-8 w-full
                        h-full rounded-3xl bg-neutral-950 hover:bg-neutral-900
                        ${isFinished ? "cursor-not-allowed" : "cursor-pointer"} p-4
                        border border-neutral-900 hover:border-neutral-800
                        `}>
            <div className='flex items-center justify-between w-full'>
                <ToggleBetweenChildren isOpen={Boolean(isInfinite)}>
                    <InfinitySVG/>
                    <span/>
                </ToggleBetweenChildren>
                <span
                    className={`font-bold ${!isFinished ? "text-green-500" : "text-neutral-500 "} whitespace-nowrap`}>+{value}</span>
            </div>
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

    const randomAddresses = [
        "0x038db6c62d0f072616e2b8db7d3d7cfc829f7f65",
        "0x08a4e866425b4ed4ea8af9c5eb2e5eab21b3078a",
        "0x44c4503c34079759100191d2a36b2ebb38892c48"
    ]

    return (
        <GeneralContainer className='relative flex items-center py-28 gap-4'>
            <div className='flex flex-col gap-12 max-w-2xl z-10'>
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
                <div className='flex items-center  gap-4'>
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
            <Image src='/pngs/coins-amet.png' alt="Coins Dropping from top on Amet Finance"
                   width={864} height={1008}
                   className='object-cover rounded-xl'/>
        </GeneralContainer>
    )
}


function ConditionalContainer({children, isOpen}: { children: ReactNode, isOpen: boolean }) {
    return (<ConditionalRenderer isOpen={isOpen}>
        <div className='xl:col-span-3 md:col-span-4 sm:col-span-6 col-span-12 w-full'>
            {children}
        </div>
    </ConditionalRenderer>)
}

function ActionButton({children, onClick}: { children?: ReactNode, onClick?: any }) {
    return (
        <button onClick={onClick}
                className='text-sm font-medium px-8 py-2 bg-neutral-700 rounded-3xl hover:bg-green-500 whitespace-nowrap'>{children}
        </button>
    )
}
