import Styles from "./index.module.css";
import Link from "next/link";
import {openModal} from "@/store/redux/modal";
import {ModalTypes} from "@/store/redux/modal/constants";
import AmetLogo from "../../../public/svg/amet-logo";
import {Account} from "@/store/redux/account/type";
import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import * as Web3Service from "@/modules/web3";
import {connectWallet, disconnectWallet} from "@/store/redux/account";
import {shorten} from "@/modules/web3/utils/address";


export default function Navbar() {

    useEffect(() => {
        const address = Web3Service.getWalletAddress();
        if (address) {
            connectWallet({address})
        }
    }, [])

    return <>
        <nav className={Styles.container}>
            <div className={Styles.nav}>
                <AmetLogo/>
                <div className={Styles.navLinks}>
                    <NavItem/>
                </div>
            </div>
            <WalletState/>
        </nav>
    </>
}

function NavItem() {
    return <>
        <div className={Styles.navItem}>
            <Link href='/bonds'>
                <span className={Styles.navHover}>On-chain Bonds</span>
            </Link>
            <div className={Styles.navDropDown}>
                <Link href='/bonds/issue'>
                    <span className={Styles.navHover}>Issue</span>
                </Link>
                <Link href='/bonds/explore'>
                    <span className={Styles.navHover}>Explore</span>
                </Link>
            </div>
        </div>
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
                    <span className={Styles.disconnect} onClick={disconnectWallet}>Disconnect</span>
                </div>
            </>}
        </div>
    </>
}