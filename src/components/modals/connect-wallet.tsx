import {closeModal} from "@/store/redux/modal";
import * as Web3Service from '../../modules/web3'
import {CHAIN_IDS, WalletTypes} from "@/modules/web3/constants";
import Image from "next/image";
import Link from "next/link";
import {URLS} from "@/modules/utils/urls";
import {toast} from "react-toastify";
import {useRouter} from "next/router";

export default function ConnectWallet() {

    const router = useRouter();

    console.log()
    function connect() {
        Web3Service.connectWallet({
            type: WalletTypes.Metamask,
            chainId: router.query.chainId?.toString() || CHAIN_IDS.Mumbai,
            requestAccounts: true,
            requestChain: true
        })
            .catch(error => {
                return toast.error(error.message)
            })
    }

    return <>
        <div className="flex items-start gap-16">
            <div className="flex flex-col gap-4 max-w-xs">
                <p className="text-2xl font-bold">Connect Your Wallet</p>
                <p className='text-g'>
                    By connecting your wallet, you acknowledge that you have read,
                    understood, and agree to be bound by our
                    <Link href={URLS.TermsOfService} target="_blank">
                        <b>Terms and Conditions</b>
                    </Link>
                    and
                    <Link href={URLS.PrivacyPolicy} target="_blank">
                        <b>Privacy Policy</b>
                    </Link>.
                </p>
            </div>
            <div className='flex flex-col gap-2'>
                <button
                    className="flex items-center justify-around gap-2 py-2 px-6 border border-solid border-w1 rounded bg-white"
                    onClick={connect}>
                    <Image src='/svg/metamask.svg' width='28' height='28' alt='Metamask'/>
                    <span className="text-black">Metamask</span>
                </button>
            </div>
        </div>
    </>
}
