import Link from "next/link";
import {URLS} from "@/modules/utils/urls";

function Percentages({setter}: Readonly<{ setter: any }>) {
    const percentages = [10, 20, 50, 75, 100];

    return <div className='flex justify-between items-center gap-1 w-full'>
        {percentages.map(percent => <Percentage percent={percent} setter={setter} key={percent}/>)}
    </div>
}

function Percentage({percent, setter}: Readonly<{ percent: number, setter: any }>) {
    return <button
        className='border border-neutral-900 w-full text-center rounded-md text-sm hover:bg-neutral-800 cursor-pointer'
        onClick={() => setter(percent)}>{percent}%</button>
}

function Agreement({actionType}: Readonly<{ actionType: string }>) {
    return <p className='text-xs text-neutral-600'>
        <span>By {actionType}, you agree to the </span>
        <Link href={URLS.TermsOfService} target="_blank">
            <u>Terms and Conditions.</u></Link>
    </p>
}


export {
    Percentages,
    Agreement
}
