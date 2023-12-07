import Styles from "./index.module.css";
import Link from "next/link";
import AmetLogo from "../../../public/svg/amet-logo";
import {useEffect, useRef, useState} from "react";
import * as AccountSlice from "@/store/redux/account";
import BurgerSVG from "../../../public/svg/burger";
import XmarkSVG from "../../../public/svg/xmark";
import Image from "next/image";
import {useWeb3Modal} from '@web3modal/wagmi/react'

import {useAccount, useDisconnect, useNetwork, useSwitchNetwork} from "wagmi";
import {CHAINS, defaultChain, getChainIcon} from "@/modules/utils/wallet-connect";
import {NAV_ITEMS} from "@/components/navbar/constants";
import {shorten} from "@/modules/web3/util";
import Loading from "@/components/utils/loading";
import {nop} from "@/modules/utils/function";


export default function Navbar() {
    const {address} = useAccount();
    const {chain} = useNetwork();

    useEffect(() => {
        if (address && chain?.id) {
            AccountSlice.initBalance(address, chain?.id).catch(nop)
        }
    }, [address, chain]);

    return <>
        <DesktopNav/>
        <MobileNav/>
    </>
}

function DesktopNav() {
    return <>
        <nav className='relative justify-between items-center px-20 py-3 w-full md:flex sm:hidden'>
            <div className='flex items-center gap-8 z-50'>
                <AmetLogo/>
                <div className='flex items-center gap-6'>
                    {NAV_ITEMS.map((item: any, index: number) => <NavItem item={item} key={index}/>)}
                </div>
            </div>
            <WalletState/>
        </nav>
    </>
}

function MobileNav() {
    const [isVisible, setVisible] = useState(false);

    const changeVisibility = () => setVisible(!isVisible)

    return <>
        <nav className="relative  justify-between items-center px-8 py-3 w-full md:hidden sm:flex">
            <AmetLogo/>
            <div className='flex items-center z-50'>
                {!isVisible ? <BurgerSVG onClick={changeVisibility}/> : <XmarkSVG onClick={changeVisibility}/>}
            </div>
            {
                Boolean(isVisible) && <MobileLinks changeVisibility={changeVisibility}/>
            }
        </nav>
    </>
}

function MobileLinks({changeVisibility}: any) {
    return <>
        <div
            className='fixed left-0 top-0 w-full h-screen bg-black z-10 flex flex-col items-start p-0 px-8 gap-8'>
            <div className='flex flex-col items-start gap-4 mt-32' onClick={changeVisibility}>
                {NAV_ITEMS.map((item: any, index: number) => <NavItem item={item} key={index}/>)}
            </div>
            <WalletState changeVisibility={changeVisibility} isMobile/>
        </div>
    </>
}

function NavItem({item}: any) {

    const {title, defaultUrl, defaultTarget, links} = item;

    return <>
        <div className={Styles.navItem}>
            <Link href={defaultUrl} target={defaultTarget || "_self"}>
                <span className={`${Styles.navHover} ${Styles.top}`}>{title}</span>
            </Link>
            {
                links?.length &&
                <>
                    <div className={Styles.navDropDown}>
                        {links.map((item: any, index: number) => <NavLink link={item} key={index}/>)}
                    </div>
                </>}
        </div>
    </>
}

function NavLink({link}: any) {
    return <>
        <Link href={link.url} target={link.target || "_self"}>
            <span className={Styles.navHover}>{link.name}</span>
        </Link>
    </>
}


function WalletState({changeVisibility, isMobile}: { changeVisibility?: any, isMobile?: boolean }) {
    const account = useAccount()
    const [address, setAddress] = useState<string | undefined>('')

    useEffect(() => setAddress(account.address), [account.address, account.isConnected]);

    return <>
        <div className={'relative flex items-center ' + (isMobile ? " gap-0" : " gap-2")}>
            <Chains/>
            {address ? <ConnectedState isMobile/> : <ConnectButton changeVisibility={changeVisibility}/>}
        </div>
    </>
}

function ConnectButton({changeVisibility}: any) {
    const {open} = useWeb3Modal()


    async function connect() {
        await open();
        if (changeVisibility) changeVisibility();
    }


    return <>
        <button className="border border-w1 rounded px-4 py-1.5 cursor-pointer m-0 hover:bg-white hover:text-black"
                onClick={connect}>Connect
        </button>
    </>
}

function ConnectedState({isMobile}: { isMobile?: boolean }) {
    const {address} = useAccount();
    const boxRef = useRef<any>()
    const [isEnabled, setEnabled] = useState(false);
    const enable = () => setEnabled(!isEnabled)

    useEffect(() => {
        const handleClickOutside = (event: Event) => {
            if (boxRef.current && !boxRef.current.contains(event.target)) {
                setEnabled(false);
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [boxRef]);

    return <>
        <div className="relative" ref={boxRef}>
            <button className='border border-w1 rounded px-4 py-1.5 cursor-pointer m-0'
                    onClick={enable}>{shorten(address, 5)}</button>
            <WalletDropDown enableHandler={[isEnabled, setEnabled, enable]}/>
        </div>
    </>
}

function WalletDropDown({enableHandler}: { enableHandler: any }) {
    const {address} = useAccount()
    const {disconnect} = useDisconnect()
    const [isEnabled, setEnabled, enable] = enableHandler;
    const dropStyles = `${Styles.addressDropDown} ${isEnabled && Styles.enabledDrop}`

    if (!isEnabled) {
        return null;
    }

    return <>
        <div className={dropStyles + " bg-black border border-w1 rounded"} onClick={enable}>
            <Link href={`/address/${address}`} className='w-full text-center'>
                <span className='w-full'>Dashboard</span>
            </Link>
            {/*<Link href="/affiliate" className='w-full text-center'>*/}
            {/*    <span className='w-full'>Affiliate</span>*/}
            {/*</Link>*/}
            <button className="w-full text-center" onClick={() => disconnect?.()}>Disconnect</button>
        </div>
    </>
}

function Chains() {
    const [isOpen, setOpen] = useState(false)
    const boxRef = useRef<any>()

    const {isConnecting, isReconnecting} = useAccount();
    const network = useNetwork();
    const chain = network.chain || defaultChain;


    const change = () => setOpen(!isOpen)

    useEffect(() => {
        const handleClickOutside = (event: Event) => {
            if (boxRef.current && !boxRef.current.contains(event.target)) {
                setOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => document.removeEventListener('click', handleClickOutside);
    }, [boxRef]);

    if (isConnecting || isReconnecting) {
        return <Loading percent={50}/>;
    }


    return <>
        <div className='relative flex flex-col p-2' ref={boxRef}>
            <Image src={getChainIcon(chain.id)}
                   alt={chain?.name}
                   width={30} height={30}
                   className='cursor-pointer'
                   onClick={change}/>
            {isOpen && <ChainsDropDown change={change}/>}
        </div>
    </>
}

function ChainsDropDown({change}: any) {
    return <>
        <div className='
        absolute top-14 right-0 min-w-max flex flex-col bg-b1 px-3 py-1 rounded z-40 max-h-36 overflow-x-auto
        md:left-auto sm:left-0 border border-w1
        '
             onClick={change}>
            {CHAINS.map(chain => <Chain chain={chain} key={chain.id}/>)}
        </div>
    </>
}

function Chain({chain}: any) {
    const {open} = useWeb3Modal()
    const {address, isConnected} = useAccount()
    const {switchNetworkAsync} = useSwitchNetwork()


    async function change() {
        try {
            if (!address) {
                await open({view: "Connect"})
            } else {
                await switchNetworkAsync?.(chain.id)
            }
        } catch (error: any) {
            console.log(error)
        }
    }

    return <>
        <div className='flex gap-2 items-center hover:bg-b2 cursor-pointer p-2 rounded' onClick={change}>
            <Image src={getChainIcon(chain.id)} alt={chain.name} width={22} height={22} className='cursor-pointer'/>
            <span className='text-sm'>{chain.name}</span>
        </div>
    </>
}
