import BondCard from "@/components/pages/bonds/utils/bond-card";
import SearchSVG from "../../../../../../public/svg/utils/search";
import FilterSVG from "../../../../../../public/svg/utils/filter";
import {useEffect, useState} from "react";
import ContractAPI from "@/modules/cloud-api/contract-api";
import {ContractCoreDetails, ContractQuery} from "@/modules/cloud-api/contract-type";
import ArrowBasicSVG from "../../../../../../public/svg/utils/arrow-basic";
import {CHAINS, getChainIcon} from "@/modules/utils/wallet-connect";
import Image from "next/image";
import {shortenString} from "@/modules/utils/string";
import {ConditionalRenderer, GeneralContainer, useShow} from "@/components/utils/container";
import {Chain} from "wagmi";

export default function Explore() {

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const openOrCloseFilter = () => setIsFilterOpen(!isFilterOpen);

    return (
        <GeneralContainer className='flex flex-col justify-center items-center w-full py-24 gap-12' isPadding>
            <div className='flex flex-col items-center gap-8 px-8'>
                <h1 className='text-5xl text-center font-bold'>Explore On-Chain Bonds: <br/>
                    Find, Filter, and Invest</h1>
                <div className='h-px w-1/4 bg-white'/>
                <p className='text-neutral-400 text-sm text-center'>Discover a range of on-chain bonds through advanced
                    filters and
                    intuitive search options.</p>
            </div>
            <div className='flex flex-col gap-12 w-full pt-8'>
                <div className='flex flex-col gap-4'>
                    <div className='flex items-stretch justify-end gap-4'>
                        <button className='flex items-center gap-2 px-4 py-1.5 bg-neutral-900 rounded-md cursor-pointer'
                                onClick={openOrCloseFilter}>
                            <span>Filter</span>
                            <FilterSVG size={16}/>
                        </button>
                        <div className='flex gap-2 items-center border border-w1 rounded-md px-4 py-1.5'>
                            <input type="text"
                                   className='h-full bg-transparent w-full md:min-w-[18rem] min-w-0 placeholder:text-neutral-500 placeholder:text-sm'
                                   placeholder='Search By Contract Address, Issuer Address, Token Symbol'/>
                            <SearchSVG/>
                        </div>
                    </div>
                    <ConditionalRenderer isOpen={isFilterOpen}>
                        <FilterContainer/>
                    </ConditionalRenderer>
                </div>
                <div className='grid 2xl:grid-cols-3 md-lg:grid-cols-2 grid-cols-1 gap-2'>
                    <BondCards/>
                </div>
            </div>
        </GeneralContainer>
    )
}

function FilterContainer() {

    const [params, setParams] = useState<ContractQuery>({});

    const selectChain = (chainId: number) => setParams({...params, chainId})

    return <div className='flex gap-4 items-center z-50'>
        <ChainSelector selectChain={selectChain}/>
        <div className='relative'>
            <div className='flex items-center gap-1 bg-neutral-900 p-2 px-4 rounded-full'>
                <span className='text-sm'>Chain</span>
                <ArrowBasicSVG classname='stroke-white' sPercentage={-25}/>
            </div>
        </div>
        <div className='relative'>
            <div className='flex items-center gap-1 bg-neutral-900 p-2 px-4 rounded-full'>
                <span className='text-sm'>Chain</span>
                <ArrowBasicSVG classname='stroke-white' sPercentage={-25}/>
            </div>
        </div>
        <div className='relative'>
            <div className='flex items-center gap-1 bg-neutral-900 p-2 px-4 rounded-full'>
                <span className='text-sm'>Chain</span>
                <ArrowBasicSVG classname='stroke-white' sPercentage={-25}/>
            </div>
        </div>
        <div className='relative'>
            <div className='flex items-center gap-1 bg-neutral-900 p-2 px-4 rounded-full'>
                <span className='text-sm'>Chain</span>
                <ArrowBasicSVG classname='stroke-white' sPercentage={-25}/>
            </div>
        </div>
    </div>
}

function ChainSelector({selectChain}: Readonly<{ selectChain: (chainId: number) => void }>) {
    const {isOpen, openOrClose} = useShow();

    const selectChainAndClose = (chainId: number) => {
        openOrClose()
        selectChain(chainId)
    }

    return <div className='relative'>
        <button className='flex items-center gap-1 bg-neutral-900 p-2 px-4 rounded-full cursor-pointer'
                onClick={openOrClose}>
            <span className='text-sm'>Chain</span>
            <ArrowBasicSVG classname='stroke-white' sPercentage={-25}/>
        </button>
        <ConditionalRenderer isOpen={isOpen}>
            <div className='flex flex-col absolute top-[110%] bg-neutral-900 rounded-xl px-4 py-4 w-max'>
                {CHAINS.map(chain => <ChainWrapper chain={chain} selectChain={selectChainAndClose} key={chain.id}/>)}
            </div>
        </ConditionalRenderer>
    </div>
}

function ChainWrapper({chain, selectChain}: { chain: Chain, selectChain: (chainId: number) => void }) {
    return <button className='flex items-center gap-1 w-full px-2 py-1 hover:bg-neutral-700 rounded-md cursor-pointer'
                   onClick={() => selectChain(chain.id)}>
        <Image src={getChainIcon(chain.id)} alt={chain.name} width={24} height={24}/>
        <span
            className='text-neutral-400 whitespace-nowrap text-sm'>{shortenString(chain.name, 20)}</span>
    </button>
}

function BondCards() {

    const [contracts, setContracts] = useState<ContractCoreDetails[]>([])

    useEffect(() => {
        const params = {}
        ContractAPI.getContractsBasic(params)
            .then(result => {
                if (result?.length) setContracts(result)
            })
    }, []);

    return <>
        {contracts.map(contract => <BondCard info={contract} key={contract._id}/>)}
    </>
}
