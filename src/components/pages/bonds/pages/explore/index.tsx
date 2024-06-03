import BondCard from "@/components/pages/bonds/utils/bond-card";
import React, {useState} from "react";
import {ContractQuery} from "@/modules/api/contract-type";
import ArrowBasicSVG from "../../../../../../public/svg/utils/arrow-basic";
import {CHAINS, defaultChain, getChain, getChainIcon} from "@/modules/utils/wallet-connect";
import Image from "next/image";
import {shortenString} from "@/modules/utils/string";
import {ConditionalRenderer, GeneralContainer, ToggleBetweenChildren, useShow} from "@/components/utils/container";
import {Chain} from "wagmi";
import {useContracts} from "@/components/pages/bonds/utils/contracts";
import {HorizontalLoading} from "@/components/utils/loading";
import {useTokensByChain} from "@/modules/utils/token";
import {TokenResponse} from "@/modules/api/type";
import makeBlockie from "ethereum-blockies-base64";
import {zeroAddress} from "viem";
import XmarkSVG from "../../../../../../public/svg/utils/xmark";

export default function Explore() {


    const [filter, setFilter] = useState<ContractQuery>({chainId: defaultChain.id})


    return (
        <GeneralContainer className='flex flex-col justify-center items-center w-full sm:py-24 py-12 gap-12' isPadding>
            <div className='flex flex-col items-center gap-8 px-8'>
                <h1 className='text-5xl text-center font-bold'>Explore On-Chain Bonds: <br/>
                    Find, Filter, and Invest</h1>
                <div className='h-px w-1/4 bg-white'/>
                <p className='text-neutral-400 text-sm text-center'>Discover a range of on-chain bonds through advanced
                    filters and
                    intuitive search options.</p>
            </div>
            <div className='flex flex-col gap-8 w-full pt-8'>
                <FilterContainer filterHandler={[filter, setFilter]}/>
                <div className='grid 2xl:grid-cols-3 md-lg:grid-cols-2 grid-cols-1 gap-2'>
                    <BondCards filter={filter}/>
                </div>
            </div>
        </GeneralContainer>
    )
}

function FilterContainer({filterHandler}: Readonly<{ filterHandler: [ContractQuery, any] }>) {


    const [filter, setFilter] = filterHandler

    const selectChain = (chainId: number) => setFilter({...filter, chainId})

    return (
        <div className='flex gap-4 items-center z-50'>
            <ChainSelector params={filter} selectChain={selectChain}/>
            <TokenSelector filterHandler={filterHandler} type={"purchaseToken"}/>
            <TokenSelector filterHandler={filterHandler} type={"payoutToken"}/>
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


function TokenSelector({filterHandler, type}: Readonly<{
    filterHandler: [ContractQuery, any],
    type: "purchaseToken" | "payoutToken"
}>) {

    const [filter, setFilter] = filterHandler
    const {isOpen, openOrClose} = useShow();
    const isPurchase = type === "purchaseToken"


    const selectToken = (contractAddress: string) => setFilter({...filter, [type]: contractAddress})
    const removeToken = (event: Event) => {
        delete filter[type];
        setFilter({...filter})
        event.stopPropagation()
    }

    const tokens = useTokensByChain(filter.chainId);
    const verifiedTokens = Object.values(tokens);
    let selectedToken;
    if (isPurchase) {
        selectedToken = filter.purchaseToken ? tokens[filter.purchaseToken] : undefined
    } else {
        selectedToken = filter.payoutToken ? tokens[filter.payoutToken] : undefined
    }

    const icon = selectedToken?.icon ?? makeBlockie(`${selectedToken?.contractAddress}`)
    const name = `${selectedToken?.name}`.toString()

    const selectTokenAndClose = (contractAddress: string) => {
        selectToken(contractAddress)
        openOrClose()
    }


    const title = isPurchase ? "Purchase" : "Payout";

    return (
        <div className='relative'>
            <button className='flex items-center gap-2 bg-neutral-900 p-2 px-4 rounded-full cursor-pointer'
                    onClick={openOrClose}>
                <ToggleBetweenChildren isOpen={Boolean(selectedToken)}>
                    <>
                        <Image src={icon} alt={name} width={24} height={24} className='rounded-full'/>
                        <span className='text-sm'>{name}</span>
                    </>
                    <span className='text-sm'>{title} Token</span>
                </ToggleBetweenChildren>
                <ToggleBetweenChildren isOpen={isOpen || !selectedToken}>
                    <ArrowBasicSVG classname={`stroke-white ${isOpen && "rotate-180"}`} sPercentage={-25}
                                   onClick={openOrClose}/>
                    <XmarkSVG isSmall onClick={removeToken}/>
                </ToggleBetweenChildren>
            </button>
            <ConditionalRenderer isOpen={isOpen}>
                <div className='flex flex-col absolute top-[110%] bg-neutral-900 rounded-md p-2 w-max'>
                    {verifiedTokens.map(token => <TokenForSelector token={token}
                                                                   key={token.contractAddress}
                                                                   onClick={selectTokenAndClose}/>)}
                </div>
            </ConditionalRenderer>
        </div>
    )
}

function TokenForSelector({token, onClick}: Readonly<{ token: TokenResponse, onClick: any }>) {

    const iconSrc = token.icon ?? makeBlockie(zeroAddress);

    return <button
        className='flex items-center gap-1 w-full cursor-pointer px-4 py-2 hover:bg-neutral-800 rounded-md whitespace-nowrap'
        onClick={() => onClick(token.contractAddress)}>
        <Image src={iconSrc} alt={token.name} width={22} height={22}
               className='rounded-full border border-neutral-800'/>
        <p className='text-neutral-300 text-sm'>{token.name} <span
            className='text-neutral-500'>({token.symbol})</span></p>
    </button>
}

function ChainWrapper({chain, selectChain}: Readonly<{ chain: Chain, selectChain: (chainId: number) => void }>) {

    return (
        <button className='flex items-center gap-1 w-full px-2 py-1 hover:bg-neutral-700 rounded-md cursor-pointer'
                onClick={() => selectChain(chain.id)}>
            <Image src={getChainIcon(chain.id)} alt={chain.name} width={24} height={24}/>
            <span className='text-neutral-400 whitespace-nowrap text-sm'>{shortenString(chain.name, 20)}</span>
        </button>
    )
}

function BondCards({filter}: Readonly<{ filter: ContractQuery }>) {
    const {isLoading, contracts} = useContracts(filter);

    return (
        <ToggleBetweenChildren isOpen={isLoading}>
            <HorizontalLoading className='col-span-3 h-32'/>
            {contracts.map(contract => <BondCard info={contract} key={contract.contractAddress}/>)}
        </ToggleBetweenChildren>
    )
}
