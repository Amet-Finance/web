import Styles from "./index.module.css";
import Link from "next/link";
import {closeModal, openModal} from "@/store/redux/modal";
import {ModalTypes} from "@/store/redux/modal/constants";
import AmetLogo from "../../../public/svg/amet-logo";
import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import * as Web3Service from "@/modules/web3";
import {shorten} from "@/modules/web3/utils/address";
import * as AccountSlice from "@/store/redux/account";
import {RootState} from "@/store/redux/type";
import {join} from "@/modules/utils/styles";
import BurgerSVG from "../../../public/svg/burger";
import XmarkSVG from "../../../public/svg/xmark";
import Image from "next/image";
import {CHAIN_IDS, CHAIN_INFO, DEFAULT_CHAIN_ID, WalletTypes} from "@/modules/web3/constants";
import {URLS} from "@/modules/utils/urls";


const navItems: any = [
    {
        title: "Bonds",
        defaultUrl: "/bonds",
        links: [
            {
                url: '/bonds/issue',
                name: "Issue"
            },
            {
                url: '/bonds/explore',
                name: "Explore"
            },

        ]
    },
    {
        title: "Documentation",
        defaultUrl: URLS.Docs,
        defaultTarget: "_blank"
    }
]


export default function Navbar() {

    useEffect(() => {
        Web3Service.connectWallet({
            type: WalletTypes.Metamask,
            chainId: DEFAULT_CHAIN_ID,
            hideError: true
        })
    }, [])

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
                    {navItems.map((item: any, index: number) => <NavItem item={item} key={index}/>)}
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
                {navItems.map((item: any, index: number) => <NavItem item={item} key={index}/>)}
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
    const account = useSelector((item: RootState) => item.account);

    return <>
        <div className='relative flex items-center gap-2'>
            <Chains/>
            {account.address ? <ConnectedState/> : <ConnectButton changeVisibility={changeVisibility}/>}
        </div>
    </>
}

function ConnectButton({changeVisibility}: any) {
    const connect = () => {
        openModal(ModalTypes.ConnectWallet);
        if (changeVisibility) changeVisibility();
    }

    return <>
        <button className={Styles.connect} onClick={connect}>Connect</button>
    </>
}

function ConnectedState() {
    const [isEnabled, setEnabled] = useState(false);
    const account = useSelector((item: RootState) => item.account);
    const enable = () => setEnabled(!isEnabled);
    const addressStyles = `${Styles.address} ${!isEnabled && Styles.addressBorder} ${isEnabled && Styles.enabledAddress}`
    const dropStyles = `${Styles.addressDropDown} ${isEnabled && Styles.enabledDrop}`

    return <>
        <div className={Styles.addressContainer}>
            <span className={addressStyles} onClick={enable}>{shorten(account.address)}</span>
            {isEnabled && <>
                <div className={dropStyles} onClick={enable}>
                    <Link href={`/address/${account.address}`}>
                        <span>My Account</span>
                    </Link>
                    <span className={Styles.disconnect} onClick={AccountSlice.disconnectWallet}>Disconnect</span>
                </div>
            </>}
        </div>
    </>
}

function Chains() {
    const [isOpen, setOpen] = useState(false)
    const account = useSelector((item: RootState) => item.account);
    // console.log(account)
    const icon = `/svg/chains/${account.chainId}.svg`
    const chainInfo = CHAIN_INFO[account.chainId]

    const change = () => setOpen(!isOpen)

    return <>
        <div className='relative flex flex-col p-2'>
            <Image src={icon}
                   alt={chainInfo.chainName}
                   width={30} height={30}
                   className='cursor-pointer'
                   onClick={change}/>
            {isOpen && <ChainsDropDown change={change}/>}
        </div>
    </>
}

function ChainsDropDown({change}: any) {
    return <>
        <div className='absolute top-14 right-0 min-w-max flex flex-col gap-2 bg-b1 px-4 py-2 rounded z-40'
             onClick={change}>
            {Object.values(CHAIN_IDS).map(chainId => <Chain chainId={chainId} key={chainId}/>)}
        </div>
    </>
}

function Chain({chainId}: { chainId: string }) {
    const icon = `/svg/chains/${chainId}.svg`
    const chainInfo = CHAIN_INFO[chainId]

    function change() {
        Web3Service.connectWallet({
            type: WalletTypes.Metamask,
            chainId,
            requestChain: true,
            hideError: true
        })
    }

    return <>
        <div className='flex gap-2 items-center hover:bg-b2 cursor-pointer p-2 rounded' onClick={change}>
            <Image src={icon} alt={chainInfo.chainName} width={30} height={30} className='cursor-pointer'/>
            <span>{chainInfo.chainName}</span>
        </div>
    </>
}