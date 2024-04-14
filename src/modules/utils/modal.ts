import {useSelector} from "react-redux";
import {RootState} from "@/store/redux/type";
import ModalStore from "@/store/redux/modal";
import {ModalTypes} from "@/store/redux/modal/constants";

function useModal() {
    const modalState = useSelector((item: RootState) => item.modal)

    return {
        modalState,
        isClosed: modalState.type === ModalTypes.None,
        open: ModalStore.openModal,
        close: ModalStore.closeModal
    }
}

export {
    useModal
}
