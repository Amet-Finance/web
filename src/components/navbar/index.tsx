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


const navItems: any = [
    {
        title: "Bonds",
        defaultUrl: "/bonds",
        links: [
            {
                url: '/bonds',
                name: "Overview"
            },
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
        title: "Documents",
        defaultUrl: "/",
        links: [
            {
                url: '/',
                name: "Overview"
            }
        ]
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
        <nav className={Styles.container}>
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

function NavItem({item}: any) {

    const {title, defaultUrl, links} = item;

    return <>
        <div className={Styles.navItem}>
            <Link href={item.defaultUrl}>
                <span className={`${Styles.navHover} ${Styles.top}`}>{item.title}</span>
            </Link>
            <div className={Styles.navDropDown}>
                {item.links.map((item: any, index: number) => <NavLink link={item} key={index}/>)}
            </div>
        </div>
    </>
}

function NavLink({link}: any) {
    return <>
        <Link href={link.url}>
            <span className={Styles.navHover}>{link.name}</span>
        </Link>
    </>
}


function WalletState() {
    const account: Account = useSelector((item: any) => item.account);

    if (account.address) {
        return <ConnectedState/>
    }

    return <>
        <button
            className={Styles.connect}
            onClick={openModal.bind(null, ModalTypes.ConnectWallet)}>Connect
        </button>
    </>
}

function ConnectedState() {
    const [isEnabled, setEnabled] = useState(false);
    const account: Account = useSelector((item: any) => item.account);
    const enable = () => setEnabled(!isEnabled);
    const addressStyles = `${Styles.address} ${!isEnabled && Styles.addressBorder} ${isEnabled && Styles.enabledAddress}`
    const dropStyles = `${Styles.addressDropDown} ${isEnabled && Styles.enabledDrop}`

    return <>
        <div className={Styles.addressContainer}>
            <span className={addressStyles} onClick={enable}>{shorten(account.address)}</span>
            {isEnabled && <>
                <div className={dropStyles}>
                    <span className={Styles.disconnect} onClick={AccountSlice.disconnectWallet}>Disconnect</span>
                </div>
            </>}
        </div>
    </>
}