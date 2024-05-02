import {BasicButton} from "@/components/utils/buttons";
import {useState} from "react";
import {useSignature} from "@/modules/utils/transaction";
import CloudAPI from "@/modules/api/cloud";
import {AuthenticatedRequest} from "@/modules/api/type";
import {ConditionalRenderer} from "@/components/utils/container";
import CongratulationsSVG from "../../../public/svg/utils/congratulations";
import WarningSVG from "../../../public/svg/utils/warning";


export default function ConnectEmail() {
    const messagePre = `By signing this message, you agree to link your email with your Amet Finance account. This allows us to send you important updates and information directly via email. No transactions will be made and this does not involve any fees.`
    const {address, message, submitSignature} = useSignature(messagePre, true)
    const [email, setEmail] = useState("")
    const [status, setStatus] = useState<boolean | null>(null)

    const isValidEmail = () => /@/i.test(email)

    function updateEmail(event: any) {
        setEmail(event.target.value);
    }

    async function submit() {
        const signature = await submitSignature();
        if (!address || !email || !signature) return;

        const params: AuthenticatedRequest = {
            address, signature, message
        }

        const response = await CloudAPI.updateEmail({email}, params);
        if (response?.success) {
            setStatus(true)
        } else {
            setStatus(false)
        }

    }

    return (
        <>
            <ConditionalRenderer isOpen={status === null}>
                <div className='flex flex-col gap-8 items-center max-w-md text-center'>
                    <span>Connect Your Email</span>
                    <p className='text-sm text-neutral-400'>Link your email now to ensure you never miss out on vital
                        information and opportunities.</p>
                    <input type="email"
                           onChange={updateEmail}
                           placeholder='Enter your email address'
                           className='bg-transparent w-full border-b-2 border-neutral-900 placeholder:text-neutral-800'/>
                    <BasicButton isBlocked={!email || !isValidEmail()} isBgWhite={!isValidEmail()}
                                 onClick={submit}>Submit</BasicButton>
                </div>
            </ConditionalRenderer>
            <ConditionalRenderer isOpen={status === true}>
                <div className='flex flex-col gap-8 items-center max-w-2xl'>
                    <CongratulationsSVG/>
                    <div className='flex flex-col gap-2 items-center'>
                        <span className='text-2xl font-bold '>Success!</span>
                        <span className='text-neutral-400 text-center'>We have sent an email with confirmation link. Check your email.</span>
                        <span className='text-neutral-600 text-sm'>Thank you for using our service!</span>
                    </div>
                </div>
            </ConditionalRenderer>
            <ConditionalRenderer isOpen={status === false}>
                <div className='flex flex-col gap-8 items-center max-w-2xl'>
                    <WarningSVG size={124}/>
                    <div className='flex flex-col gap-2 items-center'>
                        <span className='text-2xl font-bold '>Oops!</span>
                        <span className='text-neutral-400 text-center'>Something went wrong and we could not complete your request. Please try again later, or contact support if the issue persists.</span>
                        <span className='text-neutral-600 text-sm'>Thank you for your patience!</span>
                    </div>
                </div>
            </ConditionalRenderer>
        </>
    )
}
