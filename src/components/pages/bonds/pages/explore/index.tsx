import BondCard from "@/components/pages/bonds/utils/bond-card";
import {BOND_CARDS} from "@/components/pages/main/constants";
import SearchSVG from "../../../../../../public/svg/utils/search";
import FilterSVG from "../../../../../../public/svg/utils/filter";

export default function Explore() {
    return <>
        <div className='flex flex-col justify-center items-center w-full py-24 gap-12 xl1:px-36 lg:px-24 md:px-12 sm:px-0'>
            <div className='flex flex-col items-center gap-8 px-8'>
                <h1 className='text-5xl text-center font-bold'>Explore On-Chain Bonds: <br/>
                    Find, Filter, and Invest</h1>
                <div className='h-px w-1/4 bg-white'/>
                <p className='text-neutral-400 text-sm text-center'>Discover a range of on-chain bonds through advanced
                    filters and
                    intuitive search options.</p>
            </div>
            <div className='flex flex-col gap-12 bg-neutral-950 rounded-[2rem] w-full py-16 xl1:px- lg:px-8 md:px-4 sm:px-2.5'>
                <div className='flex items-stretch justify-between'>
                    <div className='flex gap-2 items-center border border-w1 rounded-md px-4 py-1'>
                        <input type="text"
                               className='h-full bg-transparent w-full md:min-w-[18rem] sm:min-w-0 placeholder:text-neutral-500 placeholder:text-sm'
                               placeholder='Search By Contract Address, Issuer Address, Token Symbol'/>
                        <SearchSVG/>
                    </div>
                    <div className='flex p-4 bg-neutral-900 rounded-md cursor-pointer'>
                        <FilterSVG/>
                    </div>
                </div>
                <div className='grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-2'>
                    <BondCard info={BOND_CARDS[0]}/>
                    <BondCard info={BOND_CARDS[1]}/>
                    <BondCard info={BOND_CARDS[2]}/>
                    <BondCard info={BOND_CARDS[3]}/>
                    <BondCard info={BOND_CARDS[3]}/>
                    <BondCard info={BOND_CARDS[2]}/>
                    <BondCard info={BOND_CARDS[2]}/>
                    <BondCard info={BOND_CARDS[0]}/>
                    <BondCard info={BOND_CARDS[1]}/>
                    <BondCard info={BOND_CARDS[3]}/>
                </div>
            </div>
        </div>
    </>
}
