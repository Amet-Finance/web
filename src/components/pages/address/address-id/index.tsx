import {GeneralContainer} from "@/components/utils/container";
import {AccountExtendedFormat} from "@/modules/api/contract-type";
import BondCard from "@/components/pages/bonds/utils/bond-card";
import {useState} from "react";
import {useTokensByChain} from "@/modules/utils/token";
import {defaultChain} from "@/modules/utils/wallet-connect";
import {formatLargeNumber} from "@/modules/utils/numbers";
import CopySVG from "../../../../../public/svg/utils/copy";
import {copyToClipboard} from "@/modules/utils/address";
import makeBlockie from "ethereum-blockies-base64";
import Image from "next/image";

export default function AddressId({accountExtendedFormat}: { accountExtendedFormat: AccountExtendedFormat }) {

    const {balances, issued, address} = accountExtendedFormat;

    return (
        <GeneralContainer className='flex flex-col gap-4 py-12 min-h-screen'>
            <div className='grid grid-cols-10 w-full h-52 gap-4'>
                <AccountContainer accountExtendedFormat={accountExtendedFormat}/>
                <AnalysisContainer accountExtendedFormat={accountExtendedFormat}/>
            </div>
            <BondsContainer accountExtendedFormat={accountExtendedFormat}/>
        </GeneralContainer>
    )
}

function AccountContainer({accountExtendedFormat}: { accountExtendedFormat: AccountExtendedFormat }) {
    const {address} = accountExtendedFormat;

    const icon = makeBlockie(address);

    return (
        <div className='flex col-span-5 w-full'>
           <div className='flex items-center gap-2 h-fit'>
               <Image src={icon} alt={address} width={1000} height={1000} className='rounded-full w-24 h-24'/>
               <div className='flex flex-col gap-2'>
                   <span>No Name</span>
                   <div className='group flex items-center gap-2 cursor-pointer'
                        onClick={copyToClipboard.bind(null, address, "Address")}>
                       <span className='text-sm text-neutral-500 p-1 w-full'>{address}</span>
                       <div className='group-hover:flex hidden'><CopySVG color="#fff"/></div>
                   </div>
               </div>
           </div>
        </div>
    )
}

function AnalysisContainer({accountExtendedFormat}: { accountExtendedFormat: AccountExtendedFormat }) {
    // unrealizedProfitUSD
    const {balances} = accountExtendedFormat;
    const tokensByChains = useTokensByChain(defaultChain.id);

    const analysis = balances.reduce((acc, item) => {
        const {bond, balance} = item;
        const payoutPre = tokensByChains[bond.purchase.contractAddress]

        if (payoutPre?.priceUsd) {
            acc.unrealizedProfitUSD += ((balance * bond.payout.amountClean) * payoutPre.priceUsd)
        }

        return acc;
    }, {unrealizedProfitUSD: 0})

    return (
        <div className='col-span-5 flex w-full'>
            <div className='flex flex-col items-end w-full'>
                <span
                    className={`text-4xl font-bold`}>${formatLargeNumber(analysis.unrealizedProfitUSD, false, 5)}</span>
                <span className='text-sm'>Unrealized Profit</span>
            </div>
        </div>
    )
}

function BondsContainer({accountExtendedFormat}: { accountExtendedFormat: AccountExtendedFormat }) {

    const {balances, issued} = accountExtendedFormat;

    const Tabs = {
        Purchased: "Purchased",
        Issued: "Issued"
        // add watchilist as well
    }

    const [tab, setTab] = useState(Tabs.Purchased)
    const isPurchased = tab === Tabs.Purchased;

    return (
        <div className='flex flex-col gap-4 w-full'>
            <div className='flex items-center w-full gap-2'>
                {Object.values(Tabs).map(value => (
                    <button className={`rounded-2xl px-4 p-2 ${value === tab ? "bg-neutral-500" : "bg-neutral-700 "}`}
                            key={value} onClick={() => setTab(value)}>
                        <span>{value}</span>
                    </button>
                ))}
            </div>
            <div className='grid grid-cols-3 gap-2'>
                {
                    isPurchased ?
                        Boolean(balances.length) && balances.map(item => <BondCard info={item.bond}
                                                                                   key={item.bond.contractAddress}/>) :
                        Boolean(issued.length) && issued.map(bond => <BondCard info={bond}
                                                                               key={bond.contractAddress}/>)
                }
            </div>

        </div>
    )
}
