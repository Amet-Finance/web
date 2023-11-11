import Styles from "./index.module.css";
import Link from "next/link";
import AmetLogo from "../../../public/svg/amet-logo";
import {useEffect, useRef, useState} from "react";
import * as AccountSlice from "@/store/redux/account";
import {join} from "@/modules/utils/styles";
import BurgerSVG from "../../../public/svg/burger";
import XmarkSVG from "../../../public/svg/xmark";
import Image from "next/image";
import {useWeb3Modal} from '@web3modal/wagmi/react'

import {useAccount, useDisconnect, useNetwork} from "wagmi";
import {CHAINS, defaultChain, getChainIcon} from "@/modules/utils/wallet-connect";
import {useSwitchNetwork} from 'wagmi'
import {NAV_ITEMS} from "@/components/navbar/constants";
import {shorten} from "@/modules/web3/util";
import Loading from "@/components/utils/loading";


export default function Navbar() {
    const {address} = useAccount();
    const {chain} = useNetwork();

    useEffect(() => {
        if (address && chain?.id) {
            AccountSlice.initBalance(address, chain?.id)
        }
    }, [address, chain]);

    return <>
        <DesktopNav/>
        <MobileNav/>
    </>
}

function DesktopNav() {
    return <>
        <nav className={join([Styles.container, Styles.destkop])}>
            <div className={Styles.nav}>
                <AmetLogo/>
                <div className={Styles.navLinks}>
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
        <nav className={join([Styles.container, Styles.mobile])}>
            <div className={Styles.nav}>
                <AmetLogo/>
            </div>
            <div className={Styles.nav}>
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
        <div className={Styles.mobileNav}>
            <div className={Styles.mobileNavLinks} onClick={changeVisibility}>
                {NAV_ITEMS.map((item: any, index: number) => <NavItem item={item} key={index}/>)}
            </div>
            <WalletState changeVisibility={changeVisibility}/>
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


function WalletState({changeVisibility}: any) {
    const account = useAccount()
    const [address, setAddress] = useState<string | undefined>('')
    useEffect(() => {
        setAddress(account.address)
    }, [account.address, account.isConnected]);

    return <>
        <div className='relative flex items-center gap-2'>
            <Chains/>
            {address ? <ConnectedState/> : <ConnectButton changeVisibility={changeVisibility}/>}
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
        <button className={Styles.connect} onClick={connect}>Connect</button>
    </>
}

function ConnectedState() {
    const {address} = useAccount()
    const {disconnect} = useDisconnect()
    const [isEnabled, setEnabled] = useState(false);
    const enable = () => setEnabled(!isEnabled)


    const dropStyles = `${Styles.addressDropDown} ${isEnabled && Styles.enabledDrop}`

    return <>
        <div className={Styles.addressContainer}>
            <button className='border border-w1 rounded px-8 py-3 cursor-pointer m-0'
                    onClick={enable}>{shorten(address)}</button>
            {isEnabled && <>
                <div className={dropStyles + " bg-black border border-w1 rounded"} onClick={enable}>
                    <Link href={`/address/${address}`}>
                        <span>Dashboard</span>
                    </Link>
                    <span className={Styles.disconnect} onClick={() => disconnect?.()}>Disconnect</span>
                </div>
            </>}
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

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
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
        absolute top-14 right-0 min-w-max flex flex-col bg-b1 px-3 py-1 rounded z-40 h-36 overflow-x-auto
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
    const {switchNetwork} = useSwitchNetwork()


    async function change() {
        if (!address) {
            await open({view: "Connect"})
        } else {
            switchNetwork?.(chain.id)
        }
    }

    return <>
        <div className='flex gap-2 items-center hover:bg-b2 cursor-pointer p-2 rounded' onClick={change}>
            <Image src={getChainIcon(chain.id)} alt={chain.name} width={22} height={22} className='cursor-pointer'/>
            <span className='text-sm'>{chain.name}</span>
        </div>
    </>
}
