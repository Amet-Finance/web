import {useEffect, useState} from "react";
import {UPDATE_INTERVAL} from "@/components/pages/bonds/pages/explore-bond-id/constants";
import {GeneralContainer} from "@/components/utils/container";

export default function LoadingScreen() {
    const [percentage, setPercentage] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => setPercentage(percentage + Math.round(Math.random() * 10)), UPDATE_INTERVAL / 20);
        return () => clearInterval(interval)
    }, [percentage]);

    return (
        <GeneralContainer className='flex gap-2 items-end w-full h-screen'>
            <div className='-translate-y-28'>
                <div className='flex items-start'>
                    <span className='text-9xl font-bold'>{percentage}</span>
                    <span className='text-2xl font-bold'>%</span>
                </div>
                <span className='text-sm text-neutral-500'>Loading the contract information...</span>
            </div>
        </GeneralContainer>
    )
}
