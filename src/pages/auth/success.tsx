import {GeneralContainer} from "@/components/utils/container";
import {useEffect} from "react";
import CongratulationsSVG from "../../../public/svg/utils/congratulations";
import {useRouter} from "next/router";

export default function AuthSuccess() {

    const router = useRouter()

    useEffect(() => {

        if (router.query.redirectTo === "twitter_follow") {
            router.push('https://twitter.com/intent/user?screen_name=amet_finance')
        } else {
            const timeout = setTimeout(() => {
                if (typeof window !== "undefined") {
                    window.close();
                }
            }, 2500)

            return () => clearTimeout(timeout);
        }
    }, [router]);

    return (
        <GeneralContainer className='flex flex-col justify-center items-center gap-8 py-40' isPadding>
            <CongratulationsSVG/>
            <div className='flex flex-col gap-2 items-center'>
                <span className='text-2xl font-bold '>Success!</span>
                <span className='text-neutral-400 text-center'>Your action has been completed. You can now return to your platform and continue where you left off.</span>
                <span className='text-neutral-600 text-sm'>Thank you for using our service!</span>
            </div>
        </GeneralContainer>
    )
}
