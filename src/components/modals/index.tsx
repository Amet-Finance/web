import {ModalTypes} from "@/store/redux/modal/constants";
import Modal, {setAppElement} from "react-modal";
import {Montserrat} from "next/font/google";
import IssuedBondSuccess from "@/components/modals/issued-bond-success";
import Quiz from "@/components/modals/quiz";
import {useSelector} from "react-redux";
import {RootState} from "@/store/redux/type";
import ClaimReferralRewards from "@/components/modals/claim-referral-rewards";
import ModalStore from "@/store/redux/modal";

const montserrat = Montserrat({subsets: ['latin']})
export default function ModalHandler() {
    const modalState = useSelector((item: RootState) => item.modal)
    const isClosed = modalState.type === ModalTypes.None;

    if (isClosed) {
        return null;
    }

    const customStyles = {
        overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.87)',
            zIndex: "1000",
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
        case ModalTypes.Quiz: {
            return <Quiz/>
        }
        case ModalTypes.ClaimReferralRewards: {
            return <ClaimReferralRewards additional={additional}/>
        }
    }
}
