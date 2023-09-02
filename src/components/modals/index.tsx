import {useSelector} from "react-redux";
import {ModalTypes} from "@/store/redux/modal/constants";
import {closeModal} from "@/store/redux/modal";
import Modal, {setAppElement} from "react-modal";
import ConnectWallet from "@/components/modals/connect-wallet";
import {Inter} from "next/font/google";
import IssuedBondSuccessModal from "@/components/modals/issued-bond-success-modal";
import {RootState} from "@/store/redux/type";

const inter = Inter({subsets: ['latin']})
export default function ModalHandler() {
    const modalState = useSelector((item: RootState) => item.modal)
    const isClosed = modalState.type === ModalTypes.None;

    if (isClosed) {
        return null;
    }

    const customStyles = {
        overlay: {
            backgroundColor: 'rgba(255, 255, 255, 0.1)'
        },
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            zIndex: "1000",
            backgroundColor: "#000",
            border: "none",
            borderRadius: "0.25rem",
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
            <div className={inter.className}>
                <ModalContent type={modalState.type}/>
            </div>
        </Modal>
    </>
}

function ModalContent({type}: any) {
    switch (type) {
        case ModalTypes.ConnectWallet: {
            return <ConnectWallet/>
        }
        case ModalTypes.IssuedBondSuccess: {
            return <IssuedBondSuccessModal/>
        }
    }
}