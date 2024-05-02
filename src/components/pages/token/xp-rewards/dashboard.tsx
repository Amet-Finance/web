import {ConditionalRenderer, GeneralContainer, ToggleBetweenChildren} from "@/components/utils/container";
import React, {ReactNode, useState} from "react";
import {copyToClipboard, useAccountExtended} from "@/modules/utils/address";
import Link from "next/link";
import {shorten} from "@/modules/web3/util";
import {hourInSec} from "@/modules/utils/dates";
import {formatLargeNumber} from "@/modules/utils/numbers";
import ShareSVG from "../../../../../public/svg/utils/share";
import SimpleSVG from "../../../../../public/svg/utils/simple";
import SocialSVG from "../../../../../public/svg/utils/social";
import ModalStore from "@/store/redux/modal";
import {ModalTypes} from "@/store/redux/modal/constants";
import {shortenString} from "@/modules/utils/string";
import {URLS} from "@/modules/utils/urls";
import InfinitySVG from "../../../../../public/svg/utils/infinity";


export default function XpRewardsDashboard() {
    const {
        _id, twitter,
        discord, xp,
        email,
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


    const linkText = `🌟 I'm earning and learning with the Amet Finance Rewards Hub!\n\n Unlock exclusive content, earn XP, and access special rewards tailored for financial enthusiasts like me. Join me and start your journey to smarter finance today! 🚀 Explore more here:`
    const hashtags = `AmetFinance,EarnCrypto,CryptoRewards`
    const shareUrl = `https://x.com/intent/tweet?text=${linkText}&url=${referralUrl}&hashtags=${hashtags}`

    const showTwitter = !settings.hideCompleted || !twitter?.id;
    const showDiscord = !settings.hideCompleted || !discord?.id;
    const showEmail = !settings.hideCompleted || !Boolean(email);


    function updateSettings(event: any) {
        setSettings({
            ...settings,
            [event.target.id]: event.target.checked
        })
    }

    function connectTwitter() {
        const clientId = "d295SDkyRFFPWV9mZDZMUV95RDg6MTpjaQ";
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
        <GeneralContainer className='grid grid-cols-12 md:py-32 py-8 gap-4' isPadding>
            <div
                className='col-span-12 flex flex-col justify-between bg-neutral-950 rounded-3xl p-6 gap-8 cursor-pointer border border-neutral-900'>
                <div className='flex justify-between w-full'>
                    <span className='text-xs text-neutral-600'>Updated {updateHoursAgo}h. ago</span>
                    <Link href={shareUrl} target='_blank'>
                        <button className='group flex items-center gap-2'>
                            <span className='text-xs text-neutral-600 hover:underline'>Share</span>
                            <ShareSVG/>
                        </button>
                    </Link>
                </div>
                <div className='flex flex-col justify-center items-center w-full gap-1'>
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

            <ConditionalContainer isOpen={!settings.hideCompleted || !active}>
                <Action
                    title="Join Rewards Hub"
                    description="Click the join button and sign with your wallet to start earning XP."
                    value="50"
                    isFinished={Boolean(active)}
                    type={<BasicType/>}
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
                    type={<BasicType/>}
                    result={(
                        <ActionButton onClick={copyToClipboard.bind(null, referralUrl, "Referral Url")}>
                            Copy Referral Url
                        </ActionButton>
                    )}
                />
            </ConditionalContainer>
            <ConditionalContainer isOpen={showTwitter}>
                <Action
                    title="Follow Amet on Twitter"
                    description="Follow us on Twitter to stay updated with the latest news and announcements."
                    value="50"
                    type={<SocialType/>}
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
                    type={<SocialType/>}
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
            <ConditionalContainer isOpen={showEmail}>
                <Action
                    title="Connect Email"
                    description="Connect your email and earn extra points"
                    value="50"
                    type={<SocialType/>}
                    isFinished={Boolean(email)}
                    result={(
                        <ToggleBetweenChildren isOpen={Boolean(email)}>
                            <div className='flex items-center gap-2 text-sm text-neutral-400'>
                                <span>Connected:</span>
                                <span
                                    className='text-white underline underline-offset-4'>{shortenString(email, 10)}</span>
                            </div>
                            <ActionButton
                                onClick={ModalStore.openModal.bind(null, ModalTypes.ConnectEmail)}>Connect</ActionButton>
                        </ToggleBetweenChildren>
                    )}
                />
            </ConditionalContainer>
            <ConditionalContainer isOpen>
                <Action
                    title="Community Contribution"
                    description="Contribute valuable content such as guides or tutorials to our platform."
                    value="Up To 500"
                    type={<SocialType/>}
                    result={(
                        <Link href={URLS.CommunityContribution} target="_blank">
                            <ActionButton>Submit</ActionButton>
                        </Link>

                    )}
                />
            </ConditionalContainer>
            <ConditionalContainer isOpen>
                <Action
                    title="Donate & Earn"
                    description="Join Amet Finance in supporting the vibrant open-source community by making a donation through Gitcoin. For every donation of at least $1, you will earn 20 XP."
                    value="20"
                    limited={"Until May 8, 2024"}
                    type={<BasicType additionalText='Note: Points for this task will be credited at the end of the grant period'/>}
                    result={(
                        <Link href={URLS.GitCoinDonate} target="_blank">
                            <ActionButton>Donate</ActionButton>
                        </Link>

                    )}
                />
            </ConditionalContainer>


            {/*<ConditionalContainer isOpen={true}>*/}
            {/*    <Action*/}
            {/*        title="Issue Bonds"*/}
            {/*        description="Issue bonds on Amet Finance and contribute to our ecosystem's growth."*/}
            {/*        value="500"*/}
            {/*        isInfinite*/}
            {/*        result={(*/}
            {/*            <Link href='/bonds/issue' target='_blank'*/}
            {/*                  className='rounded-3xl hover:bg-neutral-600'>*/}
            {/*                <ActionButton>Issue Bonds</ActionButton>*/}
            {/*            </Link>*/}
            {/*        )}*/}
            {/*        isFinished={false}*/}
            {/*    />*/}
            {/*</ConditionalContainer>*/}
            {/*<ConditionalContainer isOpen={true}>*/}
            {/*    <Action*/}
            {/*        title="Complete Redemption"*/}
            {/*        description="Earn additional XP when all your issued bonds are redeemed. 8 XP per $1 value of redeemed."*/}
            {/*        value="8"*/}
            {/*        isInfinite*/}
            {/*        result={(*/}
            {/*            <Link href={`/address/${address}?tab=issued-bonds`} target='_blank'*/}
            {/*                  className='rounded-3xl hover:bg-neutral-600'>*/}
            {/*                <ActionButton>My Issued Bonds</ActionButton>*/}
            {/*            </Link>*/}
            {/*        )}*/}
            {/*        isFinished={false}*/}
            {/*    />*/}
            {/*</ConditionalContainer>*/}
            {/*<ConditionalContainer isOpen={true}>*/}
            {/*    <Action*/}
            {/*        title="Settling Bond"*/}
            {/*        description="Settle bonds responsibly and secure your financial interactions."*/}
            {/*        value="20"*/}
            {/*        isInfinite*/}
            {/*        result={(*/}
            {/*            <Link href={`/address/${address}?tab=issued-bonds`} target='_blank'*/}
            {/*                  className='rounded-3xl hover:bg-neutral-600'>*/}
            {/*                <ActionButton>My Issued Bonds</ActionButton>*/}
            {/*            </Link>*/}
            {/*        )}*/}
            {/*        isFinished={false}*/}
            {/*    />*/}
            {/*</ConditionalContainer>*/}


            {/*<ConditionalContainer isOpen={true}>*/}
            {/*    <Action*/}
            {/*        title="Purchase Bonds"*/}
            {/*        description="Purchase any bond on the platform to invest in your future and earn XP on every $1 purchased."*/}
            {/*        value="6"*/}
            {/*        isInfinite*/}
            {/*        result={(*/}
            {/*            <Link href='/bonds/explore' target='_blank'*/}
            {/*                  className='rounded-3xl hover:bg-neutral-600'>*/}
            {/*                <ActionButton>Explore Bonds</ActionButton>*/}
            {/*            </Link>*/}
            {/*        )}*/}
            {/*        isFinished={false}*/}
            {/*    />*/}
            {/*</ConditionalContainer>*/}
            {/*<ConditionalContainer isOpen>*/}
            {/*    <Action*/}
            {/*        title="Purchase AMT Bonds"*/}
            {/*        description="Specifically purchase AMT bonds for higher rewards."*/}
            {/*        value="10"*/}
            {/*        isInfinite*/}
            {/*        result={(*/}
            {/*            // todo add exact url*/}
            {/*            <Link href='/bonds/explore' target='_blank'*/}
            {/*                  className='rounded-3xl hover:bg-neutral-600'>*/}
            {/*                <ActionButton>Explore Bonds</ActionButton>*/}
            {/*            </Link>*/}
            {/*        )}*/}
            {/*        isFinished={false}*/}
            {/*    />*/}
            {/*</ConditionalContainer>*/}
            {/*<ConditionalContainer isOpen={true}>*/}
            {/*    <Action*/}
            {/*        title="Referr Users"*/}
            {/*        description="Refer new users to purchase bonds and earn 4 XP per $1 value of referral purchase."*/}
            {/*        value="4"*/}
            {/*        isInfinite*/}
            {/*        result={(*/}
            {/*            <Link href='/bonds/explore' target='_blank'*/}
            {/*                  className='rounded-3xl hover:bg-neutral-600'>*/}
            {/*                <ActionButton>Explore Bonds</ActionButton>*/}
            {/*            </Link>*/}
            {/*        )}*/}
            {/*        isFinished={false}*/}
            {/*    />*/}
            {/*</ConditionalContainer>*/}


        </GeneralContainer>
    )
}

function Action({title, description, value, result, type, isFinished, limited}: {
    title: string,
    description: string,
    value: string,
    isFinished?: boolean
    limited?: string
    type?: ReactNode
    result?: ReactNode
}) {
    return (
        <div
            className={`relative flex flex-col justify-between items-center gap-12 w-full
                        h-full rounded-3xl bg-neutral-950 hover:bg-neutral-900
                        ${isFinished ? "cursor-not-allowed" : "cursor-pointer"} p-4
                        border border-neutral-900 hover:border-neutral-800
                        `}>
            <div className='flex justify-between w-full'>
                {type || <span/>}
                <div className='flex flex-col items-end'>
                    <span
                        className={`font-semibold ${!isFinished ? "text-green-500" : "text-neutral-500 "} whitespace-nowrap`}>+{value}</span>
                    <ConditionalRenderer isOpen={Boolean(limited)}>
                        <span className='text-neutral-700 text-mm'>{limited}</span>
                    </ConditionalRenderer>
                </div>
            </div>
            <div className='flex flex-col gap-2 items-center'>
                <span className='text-xl font-semibold'>{title}</span>
                <p className='text-xs text-center text-neutral-600'>{description}</p>
            </div>
            {result || <span/>}
        </div>
    )
}


function ConditionalContainer({children, isOpen}: Readonly<{ children: ReactNode, isOpen: boolean }>) {
    return (<ConditionalRenderer isOpen={isOpen}>
        <div className='xl:col-span-3 md:col-span-4 sm:col-span-6 col-span-12 w-full text-center'>
            {children}
        </div>
    </ConditionalRenderer>)
}

function ActionButton({children, onClick}: Readonly<{ children?: ReactNode, onClick?: any }>) {
    return (
        <button onClick={onClick}
                className='text-sm font-medium px-8 py-2 bg-neutral-700 rounded-3xl hover:bg-green-500 whitespace-nowrap'>{children}
        </button>
    )
}


function BasicType({additionalText}: {additionalText?: string}) {
    return (
        <div className='group relative'>
            <SimpleSVG size={24}/>
            <div className='group-hover:flex hidden flex-col gap-1 absolute top-full left-0 bg-neutral-950 p-2 my-2 rounded-md w-64'>
                <span className='text-neutral-400 text-xs text-start'>This is a basic task. Points are updated every 24 hours. If you do not see your points immediately, do not worry — they will be credited within a day.</span>
                <span className='text-neutral-300 text-xs text-start'>{additionalText}</span>
            </div>
        </div>
    )
}

function SocialType() {
    return (
        <div className='group relative'>
            <SocialSVG size={24}/>
            <div className='group-hover:flex hidden absolute top-full left-0 bg-neutral-950 p-2 my-2 rounded-md w-64'>
                <span className='text-neutral-400 text-xs text-start'>This is a social task. Points are updated every 24 hours. If you do not see your points immediately, do not worry — they will be credited within a day.</span>
            </div>
        </div>
    )
}
