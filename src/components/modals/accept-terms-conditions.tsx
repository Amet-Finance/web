import {BasicButton} from "@/components/utils/buttons";
import Link from "next/link";
import {URLS} from "@/modules/utils/urls";
import {useState} from "react";
import {useConnectWallet} from "@/modules/utils/address";
import ModalStore from "@/store/redux/modal";

export default function AcceptTermsConditions() {

    const {setAccepted, open} = useConnectWallet()
    const [isChecked, setIsChecked] = useState(false);

    const checkInputChanger = (event: any) => {
        setIsChecked(event.target.checked)
    }

    const connect = () => {
        setAccepted();
        ModalStore.closeModal();
        open();
    }

    return (
        <div className='flex flex-col gap-8 max-w-2xl'>
            <h1 className='text-2xl font-bold'>Connect Wallet</h1>
            <div className='flex flex-col gap-3 text-xs text-neutral-400'>
                <p >By proceeding to connect your wallet, you acknowledge
                    and agree
                    to {`Amet Finance's `}
                    <Link href={URLS.TermsOfService} target="_blank">
                        <u>Terms and Conditions</u>
                    </Link> and {" "}
                    <Link href={URLS.PrivacyPolicy} target="_blank">
                        <u>Privacy Policy.</u>
                    </Link>{" "}
                    It is important to remember that the information and services
                    provided on Amet Finance, including but not limited to bond offerings, are not to be construed as
                    financial advice.</p>
                <b>The decision to
                    engage
                    with any investment opportunity on the platform is yours and should be made based on your
                    independent
                    assessment of the risks and benefits.</b>
                <p>Please ensure you understand and are comfortable with
                    the terms of our
                    platform and the nature of on-chain bond investments before connecting your wallet.</p>
                <button className='flex items-center gap-2 text-sm text-neutral-400 cursor-pointer'>
                    <input id='checkbox' type="checkbox" onChange={checkInputChanger}/>
                    <label htmlFor="checkbox">I have read and agree to the Terms and Conditions and Privacy
                        Policy.</label>
                </button>
            </div>
            <BasicButton isBlocked={!isChecked} onClick={connect} isBgWhite={!isChecked}>
                <span>Connect</span>
            </BasicButton>
        </div>
    )
}
