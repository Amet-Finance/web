import AmetLogo from "../../../public/svg/amet-logo";
import {useEffect, useRef} from "react";
import {useAccount, useDisconnect, useNetwork} from "wagmi";
import {getChain, getChainIcon} from "@/modules/utils/wallet-connect";
import {LinkBaseType, LinkExtendedType} from "@/components/navbar/types";
import {useWeb3Modal} from "@web3modal/wagmi/react";
import makeBlockie from "ethereum-blockies-base64";
import {zeroAddress} from "viem";
import {NAV_LINKS} from "@/components/navbar/constants";
import Link from "next/link";
import {BasicButton} from "@/components/utils/buttons";
import BurgerSVG from "../../../public/svg/utils/burger";
import XmarkSVG from "../../../public/svg/utils/xmark";
import TopAnnouncement from "@/components/announcements/top-announcement";
import {shorten} from "@/modules/web3/util";
import Image from "next/image";
import SettingsSVG from "../../../public/svg/utils/settings";
import DisconnectSVG from "../../../public/svg/utils/disconnect";
import {URLS} from "@/modules/utils/urls";
import {toast} from "react-toastify";
import {AccountController} from "@web3modal/core";
import {shortenString} from "@/modules/utils/string";
import CopySVG from "../../../public/svg/utils/copy";
import {copyToClipboard} from "@/modules/utils/address";
import {format} from "@/modules/utils/numbers";
import {UPDATE_INTERVAL} from "@/components/pages/bonds/pages/explore-bond-id/constants";
import {initBalances} from "@/store/redux/account";
import {nop} from "@/modules/utils/function";
import {ConditionalRenderer, GeneralContainer, ToggleBetweenChildren, useShow} from "@/components/utils/container";


export default function Navbar() {

    const {address} = useAccount();

    useEffect(() => {
        if (address) {
            initBalances(address).catch(nop)
            const interval = setInterval(() => initBalances(address), UPDATE_INTERVAL);
            return () => clearInterval(interval);
        }
    }, [address]);


    return <nav className="fixed flex flex-col bg-black z-50 w-full">
        <TopAnnouncement/>
        <GeneralContainer className='flex justify-between items-center z-20 py-4 w-full' isPadding>
            <AmetLogo/>
            <DesktopNavbar/>
            <MobileNavbar/>
        </GeneralContainer>
    </nav>
}

function DesktopNavbar() {
    return <div className='md:flex hidden items-center gap-16'>
        <Links/>
        <WalletComponent/>
    </div>
}

function MobileNavbar() {
    const {isOpen, setIsOpen, openOrClose} = useShow();
    const boxRef = useRef<any>()

    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if (boxRef.current?.contains(event.target)) setIsOpen(false)
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside)
    }, [boxRef]);

    return <div className='md:hidden flex w-full justify-end'>
        <ToggleBetweenChildren isOpen={isOpen}>
            <XmarkSVG onClick={openOrClose}/>
            <BurgerSVG onClick={openOrClose}/>
        </ToggleBetweenChildren>
        <ConditionalRenderer isOpen={isOpen}>
            <div className='fixed w-full bg-black top-0 left-0 flex flex-col justify-between px-10 h-full py-24'
                 ref={boxRef}>
                <div>
                    {
                        NAV_LINKS.map((linkExtended) => <LinkBuilderMobile linkExtended={linkExtended}
                                                                           key={linkExtended.href}/>)
                    }
                </div>
                <div className='flex justify-center items-center w-full'>
                    <WalletComponent/>
                </div>
            </div>
        </ConditionalRenderer>
    </div>
}

function Links() {
    return <div className='flex items-center gap-7'>
        {NAV_LINKS.map(linkExtended => <LinkBuilder linkExtended={linkExtended} key={linkExtended.href}/>)}
    </div>
}

function LinkBuilder({linkExtended}: Readonly<{ linkExtended: LinkExtendedType }>) {
    return <div className='group relative'>
        <LinkBase linkBase={linkExtended} isExtended={true}/>
        <ConditionalRenderer isOpen={Boolean(linkExtended.subLinks?.length)}>
            <div
                className={'group-hover:flex hidden flex-col gap-4 justify-center absolute left-0 top-full py-4 border-b-2 border-neutral-800 bg-black'}>
                {linkExtended.subLinks?.map(linkBase => <LinkBase linkBase={linkBase} key={linkBase.href}
                                                                 isExtended={false}/>)}
            </div>
        </ConditionalRenderer>
    </div>
}

function LinkBuilderMobile({linkExtended}: Readonly<{ linkExtended: LinkExtendedType }>) {
    return <div className='group relative'>
        <LinkBase linkBase={linkExtended} isExtended={true}/>
        <ConditionalRenderer isOpen={Boolean(linkExtended.subLinks?.length)}>
            <div
                className='flex flex-col gap-4 justify-center py-4'>
                {linkExtended.subLinks?.map(linkBase => <LinkBase linkBase={linkBase} key={linkBase.href}
                                                                  isExtended={false}/>)}
            </div>
        </ConditionalRenderer>
    </div>
}

function LinkBase({linkBase, isExtended}: Readonly<{ linkBase: LinkBaseType, isExtended?: boolean }>) {
    return <Link href={linkBase.href} target={linkBase.target ?? "_self"}>
            <span
                className={`text-neutral-400 hover:text-white  whitespace-nowrap ${!isExtended && " px-4"}`}>{linkBase.title}</span>
    </Link>
}

function WalletComponent() {
    const {isConnected} = useAccount();
    const {isOpen, setIsOpen} = useShow();

    useEffect(() => {
        setIsOpen(isConnected);
    }, [isConnected]);

    return (
        <div className='cursor-pointer text-white'>
            <ToggleBetweenChildren isOpen={isOpen}>
                <ConnectedComponent/>
                <ConnectWalletComponent/>
            </ToggleBetweenChildren>
        </div>
    );
}

function ConnectedComponent() {


    const accountState = AccountController.state;

    const network = useNetwork();
    const chain = getChain(network.chain?.id);
    const {isOpen, setIsOpen, openOrClose} = useShow();
    const boxRef = useRef<any>();

    const chainIcon = chain ? getChainIcon(chain?.id) : makeBlockie(zeroAddress);

    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if (boxRef.current && !boxRef.current.contains(event.target)) setIsOpen(false)
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside)
    }, [boxRef]);

    return <div className='relative text-black' ref={boxRef}>
        <BasicButton onClick={openOrClose}>
            <div className='flex items-center gap-2'>
                <Image src={chainIcon}
                       alt={chain?.name ?? ""}
                       width={25} height={25}
                       className='cursor-pointer rounded-full p-0 m-0'/>
                <span>{shorten(accountState.address, 4)}</span>
            </div>
        </BasicButton>
        <ConditionalRenderer isOpen={isOpen}>
            <Portfolio setOpen={setIsOpen}/>
        </ConditionalRenderer>
    </div>
}

function Portfolio({setOpen}: Readonly<{ setOpen: any }>) {
    const accountState = AccountController.state
    const address = accountState.address ?? "";

    const icon = accountState.profileImage ?? makeBlockie(address);
    const name = accountState.profileName ?? "";
    const {disconnect} = useDisconnect()

    function disconnectWallet() {
        setOpen(false);
        disconnect();
    }

    return <div className='absolute right-0 top-[120%] bg-white rounded-3xl w-[200%]'>
        <div className='flex flex-col gap-8 w-full px-6 py-4'>
            <div className='flex justify-between gap-24 items-center'>
                <div className='flex items-center gap-2'>
                    <Image src={icon}
                           alt={address}
                           width={42} height={42}
                           className='cursor-pointer rounded-full p-0 m-0 border border-neutral-500'/>
                    <div className='flex flex-col gap-0'>
                        {
                            Boolean(name) && <button className='group flex items-center gap-1'
                                                     onClick={() => copyToClipboard(name, `Name`)}>
                                <span className='whitespace-nowrap font-medium'>{shortenString(name, 22)}</span>
                                <div className='group-hover:flex hidden'><CopySVG/></div>
                            </button>
                        }
                        <button className='group flex items-center gap-1'
                                onClick={() => copyToClipboard(address, `Address`)}>
                            <span className='text-sm text-neutral-800 font-light'>{shorten(address, 6)}</span>
                            <div className='group-hover:flex hidden'><CopySVG size={10}/></div>
                        </button>
                    </div>
                </div>
                <div className='flex items-center gap-1'>
                    <button className='p-1.5 hover:bg-neutral-300 rounded-md'
                            onClick={() => toast.error("Settings is not working")}>
                        <SettingsSVG color="#000"/>
                    </button>
                    <button className='p-1.5 hover:bg-neutral-300 rounded-md' onClick={disconnectWallet}>
                        <DisconnectSVG/>
                    </button>
                </div>
            </div>
            <div className='flex flex-col'>
                    <span
                        className='text-2xl font-semibold'>{format(Number(accountState.balance), 3)} {accountState.balanceSymbol}</span>
                <span className='text-sm text-green-500'>$0.00 (0.0%)</span>
            </div>
            <div className='flex flex-col text-black bg-neutral-100 rounded-md w-full'>
                <Link href={`/address/${address}`} className='px-4 py-2 rounded-md w-full hover:bg-neutral-200'>
                    <span>Portfolio</span>
                </Link>
                <Link href={`/address/${address}?tab=watchlist`}
                      className='px-4 py-2 rounded-md w-full hover:bg-neutral-200'>
                    <span>Watchlist</span>
                </Link>
            </div>
            <div className='flex items-center gap-1 justify-center text-xs text-center text-neutral-800'>
                <span>Need assistance?</span>
                <Link href={URLS.DiscordTicket} target='_blank'>
                    <span className='underline'>Create a ticket!</span>
                </Link>
            </div>
        </div>
    </div>
}


function ConnectWalletComponent() {
    const web3Modal = useWeb3Modal();
    return <BasicButton wMin onClick={() => web3Modal.open()}><span className='px-4'>Connect</span></BasicButton>
}
