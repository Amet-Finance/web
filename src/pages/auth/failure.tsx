import {GeneralContainer} from "@/components/utils/container";
import {useEffect} from "react";
import WarningSVG from "../../../public/svg/utils/warning";

export default function AuthFailure() {

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (typeof window !== "undefined") window.close();
        }, 5000)

        return () => clearTimeout(timeout);
    }, []);


    return (
        <GeneralContainer className='flex flex-col justify-center items-center gap-8 py-40' isPadding>
            <WarningSVG size={124}/>
            <div className='flex flex-col gap-2 items-center'>
                <span className='text-2xl font-bold '>Oops!</span>
                <span className='text-neutral-400 text-center'>Something went wrong and we could not complete your request. Please try again later, or contact support if the issue persists.</span>
                <span className='text-neutral-600 text-sm'>Thank you for your patience!</span>
            </div>
        </GeneralContainer>
    )
}
