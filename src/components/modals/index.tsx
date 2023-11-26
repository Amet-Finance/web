import {useSelector} from "react-redux";
import {ModalTypes} from "@/store/redux/modal/constants";
import {closeModal} from "@/store/redux/modal";
import Modal, {setAppElement} from "react-modal";
import {Montserrat} from "next/font/google";
import IssuedBondSuccessModal from "@/components/modals/issued-bond-success-modal";
import {RootState} from "@/store/redux/type";
import Quiz from "@/components/modals/quiz";
import BondEditDescription from "@/components/modals/bond-edit-description";

const montserrat = Montserrat({subsets: ['latin']})
export default function ModalHandler() {
    const modalState = useSelector((item: RootState) => item.modal)//
    const isClosed = modalState.type === ModalTypes.None;

    if (isClosed) {
        return null;
    }

    const customStyles = {
        overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.87)'
        },
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            zIndex: "100",
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
            onRequestClose={closeModal}
            contentLabel="Example Modal">
            <div className={montserrat.className}>
                <ModalContent type={modalState.type} additional={modalState.additional}/>
            </div>
        </Modal>
    </>
}

function ModalContent({type, additional}: { type: string, additional: any }) {
    switch (type) {
        case ModalTypes.IssuedBondSuccess: {
            return <IssuedBondSuccessModal/>
        }
        case ModalTypes.Quiz: {
            return <Quiz/>
        }
        case ModalTypes.BondEditDescription: {
            return <BondEditDescription additional={additional}/>
        }
    }
}
