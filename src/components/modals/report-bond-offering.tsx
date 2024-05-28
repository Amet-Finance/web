import {useModal} from "@/modules/utils/modal";
import XmarkSVG from "../../../public/svg/utils/xmark";
import {BasicButton} from "@/components/utils/buttons";
import {useSignature} from "@/modules/utils/transaction";
import {useState} from "react";
import {StringKeyedObject} from "@/components/utils/types";
import {toast} from "react-toastify";
import CloudAPI from "@/modules/api/cloud";
import {useAccountExtended} from "@/modules/utils/address";
import {ReportBody} from "@/modules/api/contract-type";

export default function ReportBondOffering() {
    const {modalState, close} = useModal()
    const {chainId, contractAddress} = modalState.additional as { chainId: number, contractAddress: string };

    const {address, open} = useAccountExtended();

    const [body, setBody] = useState({contractAddress, chainId} as ReportBody)

    const preMessage = `I am submitting a report for the bond offering on Amet Finance. This signature verifies my identity and confirms the accuracy of the information provided.`
    const {message, submitSignature} = useSignature(preMessage, true, contractAddress)

    const isBlocked = !body.email || !body.telegram || !body.description || body.description.trim().length < 20 || body.description.trim().length > 300

    let buttonTitle = 'Submit';
    if (!address) buttonTitle = "Connect";

    function updateContent(event: any) {
        setBody({
            ...body,
            [event.target.id]: event.target.value
        })
    }

    async function submit() {
        if (!address) return open();

        const signature = await submitSignature();
        if (!signature) return;

        const response = await CloudAPI.reportContract(body, {message, address, signature})
        if (response?.success) {
            toast.success(`Your report was submitted successfully.`)
            return close();
        }
    }

    return (
        <div className='flex flex-col gap-8'>
            <div className='flex items-center gap-24 w-full'>
                <span className='text-xl'>Report Bond Offering</span>
                <XmarkSVG onClick={close} isMedium/>
            </div>
            <div className='flex flex-col items-center w-full gap-4'>
                <input id='name' type="text" placeholder='Enter your Name/Username'
                       onChange={updateContent}
                       className='bg-[#131313] rounded-md placeholder:text-[#3C3C3C] py-3 px-4 text-sm w-full'/>
                <input id='email' type="email" placeholder='Enter your email address'
                       onChange={updateContent}
                       className='bg-[#131313] rounded-md placeholder:text-[#3C3C3C] py-3 px-4 text-sm w-full'/>
                <input id='telegram' type="text" placeholder='Enter your Telegram'
                       onChange={updateContent}
                       className='bg-[#131313] rounded-md placeholder:text-[#3C3C3C] py-3 px-4 text-sm w-full'/>
                <textarea id='description' rows={5} placeholder='Describe the Issue'
                          onChange={updateContent}
                          minLength={20}
                          maxLength={300}
                          required
                          className='bg-[#131313] rounded-md placeholder:text-[#3C3C3C] py-3 px-4 text-sm w-full'/>
            </div>
            <BasicButton onClick={submit} isBlocked={isBlocked && Boolean(address)}>{buttonTitle}</BasicButton>
        </div>
    )
}
