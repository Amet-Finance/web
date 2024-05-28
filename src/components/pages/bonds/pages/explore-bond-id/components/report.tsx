import ModalStore from "@/store/redux/modal";
import {ModalTypes} from "@/store/redux/modal/constants";
import {ContractCoreDetails} from "@/modules/api/contract-type";

export default function Report({contractInfo}: { contractInfo: ContractCoreDetails }) {

    function openModal() {
        return ModalStore.openModal(ModalTypes.ReportBondOffering, {
            contractAddress: contractInfo.contractAddress,
            chainId: contractInfo.chainId
        });
    }

    return (
        <p className='text-xs text-neutral-400 text-center'>
            <span>If you have concerns or need to report this bond offering, </span>
            <u className='cursor-pointer' onClick={openModal}>please click here.</u></p>
    )
}
