import {ModalTypes} from "@/store/redux/modal/constants";
import Modal, {setAppElement} from "react-modal";
import {Montserrat} from "next/font/google";
import IssuedBondSuccess from "@/components/modals/issued-bond-success";
import ClaimReferralRewards from "@/components/modals/claim-referral-rewards";
import ModalStore from "@/store/redux/modal";
import AcceptTermsConditions from "@/components/modals/accept-terms-conditions";
import FirstTimePurchaseBond from "@/components/modals/first-time-purchase-bond";
import {useModal} from "@/modules/utils/modal";
import ConnectEmail from "@/components/modals/connect-email";
import LowPayout from "@/components/modals/low-payout";

const montserrat = Montserrat({subsets: ['latin']})
export default function ModalHandler() {
    const {modalState, isClosed} = useModal()

    if (isClosed) {
        return null;
    }

    const customStyles = {
        overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.87)',
            zIndex: "60",
        },
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: "#0C0C0C",
            border: "none",
            borderRadius: "1rem",
            color: "#fff"
        },
    };

    setAppElement('body');

    return <>
        <Modal
            isOpen={!isClosed}
            style={customStyles}
            onRequestClose={ModalStore.closeModal}
            contentLabel="Example Modal">
            <div className={montserrat.className + " z-50"}>
                <ModalContent type={modalState.type} additional={modalState.additional}/>
            </div>
        </Modal>
    </>
}

function ModalContent({type, additional}: { type: string, additional: any }) {
    switch (type) {
        case ModalTypes.IssuedBondSuccess: {
            return <IssuedBondSuccess/>
        }
        case ModalTypes.ClaimReferralRewards: {
            return <ClaimReferralRewards additional={additional}/>
        }
        case ModalTypes.AcceptTermsConditions: {
            return <AcceptTermsConditions/>
        }
        case ModalTypes.FirstTimePurchaseBond: {
            return <FirstTimePurchaseBond/>
        }
        case ModalTypes.ConnectEmail: {
            return <ConnectEmail/>
        }
        case ModalTypes.LowPayout: {
            return <LowPayout/>
        }
    }
}
