import {useEffect, useState} from "react";
import RefreshSVG from "../../../../../../../public/svg/utils/refresh";

export default function HeadlineContainer({refreshHandler}: { refreshHandler: any[] }) {
    const [refreshDate, setUpdateIndex] = refreshHandler
    const [secondsPassed, setSecondsPassed] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setSecondsPassed(Math.round((Date.now() - refreshDate?.getTime()) / 1000))
        }, 500)
        return () => clearInterval(interval)
    }, [refreshDate]);

    function refresh() {
        setUpdateIndex(Math.random() * 10)
    }

    return <>
        <div className='flex justify-between'>
            <span/>
            <div className='flex items-center gap-2 px-2'>
                <span className='text-neutral-600 text-xs'>Refreshed {secondsPassed}s ago</span>
                <RefreshSVG isSmall={true} onClick={refresh}/>
            </div>
        </div>
    </>
}
