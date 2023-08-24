import {closeModal} from "@/store/redux/modal";
import * as Web3Service from '../../../modules/web3/index'
import Styles from './index.module.css'
import {WalletTypes} from "@/modules/web3/constants";
import * as AccountSlice from "@/store/redux/account";
import Image from "next/image";

export default function ConnectWallet() {

    async function connect() {
        const address = await Web3Service.connectWallet(WalletTypes.Metamask);
        if (address) {
            AccountSlice.connectWallet({address})
            closeModal();
        }
    }

    return <>
        <div className={Styles.container}>
            <div className={Styles.texts}>
                <p className={Styles.title}>Connect Your Wallet</p>
                <p>By connecting your wallet, you acknowledge that you have read, understood, and agree to be bound by our <b>Terms and Conditions</b> and <b>Privacy Policy</b>.</p>
            </div>
            <button className={Styles.wallet} onClick={connect}>
                <Image src='/svg/metamask.svg' width='32' height='32' alt='Metamask'/>
                <span>Metamask</span>
            </button>
        </div>
    </>
}