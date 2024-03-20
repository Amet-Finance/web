import BondCard from "@/components/pages/bonds/utils/bond-card";
import SearchSVG from "../../../../../../public/svg/utils/search";
import FilterSVG from "../../../../../../public/svg/utils/filter";
import {useState} from "react";
import {ContractQuery} from "@/modules/cloud-api/contract-type";
import ArrowBasicSVG from "../../../../../../public/svg/utils/arrow-basic";
import {CHAINS, getChain, getChainIcon} from "@/modules/utils/wallet-connect";
import Image from "next/image";
import {shortenString} from "@/modules/utils/string";
import {ConditionalRenderer, GeneralContainer, ToggleBetweenChildren, useShow} from "@/components/utils/container";
import {Chain} from "wagmi";
import {useContracts} from "@/components/pages/bonds/utils/contracts";
import {HorizontalLoading} from "@/components/utils/loading";

export default function Explore() {

    const {isOpen, openOrClose} = useShow()


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
                                onClick={openOrClose}>
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
                    <ConditionalRenderer isOpen={isOpen}>
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
    const selectToken = (type: string, contractAddress: string) => setParams({...params, [type]: contractAddress})


    // useEffect(() => {
    //     CloudAPI.getTokens()
    // }, [])

    return (
        <div className='flex gap-4 items-center z-50'>
            <ChainSelector params={params} selectChain={selectChain}/>
            {/*<TokenSelector params={params} type={"purchaseToken"} setter={selectToken}/>*/}
            {/*<TokenSelector params={params} type={"payoutToken"} setter={selectToken}/>*/}
        </div>
    )
}

function ChainSelector({params, selectChain}: Readonly<{
    params: ContractQuery,
    selectChain: (chainId: number) => void
}>) {
    const {isOpen, openOrClose} = useShow();

    const selectChainAndClose = (chainId: number) => {
        openOrClose()
        selectChain(chainId)
    }

    const chain = getChain(params.chainId);
    const chainIcon = getChainIcon(chain?.id);

    return (
        <div className='relative'>
            <button className='flex items-center gap-1.5 bg-neutral-900 p-2 px-4 rounded-full cursor-pointer'
                    onClick={openOrClose}>
                <ToggleBetweenChildren isOpen={Boolean(params.chainId)}>
                    <>
                        <Image src={chainIcon} alt={`${chain?.name}`} width={24} height={24}/>
                        <span className='text-sm'>{chain?.name}</span>
                    </>
                    <span className='text-sm'>Chain</span>
                </ToggleBetweenChildren>
                <ArrowBasicSVG classname={`stroke-white ${isOpen && "rotate-180"}`} sPercentage={-25}/>
            </button>
            <ConditionalRenderer isOpen={isOpen}>
                <div className='flex flex-col absolute top-[110%] bg-neutral-900 rounded-md p-2 w-max z-50'>
                    {
                        CHAINS.map(chain =>
                            <ChainWrapper chain={chain} selectChain={selectChainAndClose}
                                          key={chain.id}/>
                        )}
                </div>
            </ConditionalRenderer>
        </div>
    )
}


// function TokenSelector({
//                            params, type, setter
//                        }: {
//     params: ContractQuery,
//     type: string,
//     setter: any
// }) {
//     const {isOpen, openOrClose} = useShow();
//
//     const selectTokenAndClose = (chainId: number) => {
//         openOrClose()
//         setter(type, chainId)
//     }
//
//
//     const title = type === "purchaseToken" ? "Purchase" : "Payout";
//
//     return (
//         <div className='relative'>
//             <button className='flex items-center gap-1.5 bg-neutral-900 p-2 px-4 rounded-full cursor-pointer'
//                     onClick={openOrClose}>
//                 <ToggleBetweenChildren isOpen={Boolean(params[type])}>
//                     <>
//                         <Image src={chainIcon} alt={`${chain?.name}`} width={24} height={24}/>
//                         <span className='text-sm'>{chain?.name}</span>
//                     </>
//                     <span className='text-sm'>{title} Token</span>
//                 </ToggleBetweenChildren>
//                 <ArrowBasicSVG classname={`stroke-white ${isOpen && "rotate-180"}`} sPercentage={-25}/>
//             </button>
//             <ConditionalRenderer isOpen={isOpen}>
//                 <div className='flex flex-col absolute top-[110%] bg-neutral-900 rounded-md p-2 w-max'>
//
//                 </div>
//             </ConditionalRenderer>
//         </div>
//     )
// }

function TokenWrapper() {
    return (
        <div>

        </div>
    )
}

function ChainWrapper({chain, selectChain}: { chain: Chain, selectChain: (chainId: number) => void }) {

    return (
        <button className='flex items-center gap-1 w-full px-2 py-1 hover:bg-neutral-700 rounded-md cursor-pointer'
                onClick={() => selectChain(chain.id)}>
            <Image src={getChainIcon(chain.id)} alt={chain.name} width={24} height={24}/>
            <span className='text-neutral-400 whitespace-nowrap text-sm'>{shortenString(chain.name, 20)}</span>
        </button>
    )
}

function BondCards() {
    const params = {};
    const {isLoading, contracts} = useContracts(params);

    return (
        <ToggleBetweenChildren isOpen={isLoading}>
            <HorizontalLoading className='col-span-3 h-32'/>
            {contracts.map(contract => <BondCard info={contract} key={contract._id}/>)}
        </ToggleBetweenChildren>
    )
}
