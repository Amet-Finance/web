import Link from "next/link";
import {URLS} from "@/modules/utils/urls";

function Percentages({setter}: { setter: any }) {
    const percentages = [5, 15, 35, 50, 75, 100];

    return <>
        <div className='flex justify-between items-center gap-1'>
            {percentages.map(percent => <Percentage percent={percent} setter={setter} key={percent}/>)}
        </div>
    </>
}

function Percentage({percent, setter}: { percent: number, setter: any }) {
    return <>
            <span
                className='border border-neutral-900 w-full text-center rounded-md text-sm hover:bg-neutral-800 cursor-pointer'
                onClick={() => setter(percent)}>{percent}%</span>
    </>
}

function Agreement({actionType}: {actionType: string}) {
    return <>
        <p className='text-xs text-neutral-600'>
            <span>By {actionType}, you agree to the </span>
            <Link href={URLS.TermsOfService} target="_blank">
                <u>Terms and Conditions.</u></Link>
        </p>
    </>
}


export {
    Percentages,
    Agreement
}
