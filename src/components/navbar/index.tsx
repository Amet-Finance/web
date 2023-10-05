import Styles from "./index.module.css";
import Link from "next/link";
import {openModal} from "@/store/redux/modal";
import {ModalTypes} from "@/store/redux/modal/constants";
import AmetLogo from "../../../public/svg/amet-logo";
import {Account} from "@/store/redux/account/type";
import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import * as Web3Service from "@/modules/web3";
import {shorten} from "@/modules/web3/utils/address";
import * as AccountSlice from "@/store/redux/account";
import {RootState} from "@/store/redux/type";
import {join} from "@/modules/utils/styles";
import BurgerSVG from "../../../public/svg/burger";
import XmarkSVG from "../../../public/svg/xmark";


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
        defaultUrl: "https://docs.amet.finance/v1/",
        defaultTarget: "_blank"
    }
]


export default function Navbar() {

    useEffect(() => {
        const address = Web3Service.getWalletAddress();
        if (address) {
            AccountSlice.initWallet(address);
        }
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

    const connect = () => {
        openModal(ModalTypes.ConnectWallet);
        if(changeVisibility) changeVisibility();
    }

    if (account.address) {
        return <ConnectedState/>
    }

    return <>
        <button
            className={Styles.connect}
            onClick={connect}>Connect
        </button>
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