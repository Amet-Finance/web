import {GeneralContainer} from "@/components/utils/container";
import {AccountExtendedFormat, ContractCoreDetails} from "@/modules/api/contract-type";
import BondCard from "@/components/pages/bonds/utils/bond-card";
import {useEffect, useState} from "react";
import {useTokensByChain} from "@/modules/utils/token";
import {defaultChain} from "@/modules/utils/constants";
import {formatLargeNumber} from "@/modules/utils/numbers";
import CopySVG from "../../../../../public/svg/utils/copy";
import {copyToClipboard} from "@/modules/utils/address";
import makeBlockie from "ethereum-blockies-base64";
import Image from "next/image";
import {useRouter} from "next/router";
import TwitterSVG from "../../../../../public/svg/social/twitter";
import DiscordSVG from "../../../../../public/svg/social/discord";
import {StringKeyedObject} from "@/components/utils/types";

export default function AddressId({accountExtendedFormat}: Readonly<{ accountExtendedFormat: AccountExtendedFormat }>) {

    return (
        <GeneralContainer className='flex flex-col gap-8 py-12 min-h-screen'>
            <div className='grid grid-cols-10 w-full gap-4'>
                <AccountContainer accountExtendedFormat={accountExtendedFormat}/>
                <AnalysisContainer accountExtendedFormat={accountExtendedFormat}/>
            </div>
            <BondsContainer accountExtendedFormat={accountExtendedFormat}/>
        </GeneralContainer>
    )
}

function AccountContainer({accountExtendedFormat}: Readonly<{ accountExtendedFormat: AccountExtendedFormat }>) {
    const {_id, twitter, discord} = accountExtendedFormat;

    const icon = makeBlockie(_id);

    return (
        <div className='flex flex-col gap-8 col-span-5 w-full'>
            <div className='flex items-center gap-4 h-fit'>
                <Image src={icon} alt={_id} width={1000} height={1000} className='rounded-full w-20 h-20'/>
                <div className='flex flex-col gap-1 items-start'>
                    <button className='group flex items-center gap-2 cursor-pointer'
                            onClick={copyToClipboard.bind(null, _id, "Address")}>
                        <span className='text-sm text-neutral-500 w-full'>{_id}</span>
                        <div className='group-hover:flex hidden'><CopySVG color="#fff"/></div>
                    </button>
                </div>
            </div>
            <div className='flex items-center gap-2'>
                <TwitterSVG url={`https://x.com/${twitter?.username}`}/>
                <DiscordSVG url={`https://discord.com/users/${discord?.id}`}/>
            </div>
        </div>
    )
}

function AnalysisContainer({accountExtendedFormat}: Readonly<{ accountExtendedFormat: AccountExtendedFormat }>) {
    // unrealizedProfitUSD
    const {balances} = accountExtendedFormat;
    const tokensByChains = useTokensByChain(defaultChain.id);

    const analysis = balances.reduce((acc, item) => {
        const {bond, balance} = item;
        const payoutPre = tokensByChains[bond.payout.contractAddress]

        if (payoutPre?.priceUsd) {
            acc.unrealizedProfitUSD += ((balance * bond.payout.amountClean) * payoutPre.priceUsd)
        }

        return acc;
    }, {unrealizedProfitUSD: 0})

    return (
        <div className='col-span-5 flex w-full'>
            <div className='flex flex-col items-end w-full'>
                <span className="text-4xl font-bold">${formatLargeNumber(analysis.unrealizedProfitUSD, false, 2)}</span>
                <span className='text-sm'>Unrealized Profit</span>
            </div>
        </div>
    )
}

function BondsContainer({accountExtendedFormat}: Readonly<{ accountExtendedFormat: AccountExtendedFormat }>) {

    const {balances, issued} = accountExtendedFormat;
    const {query} = useRouter();

    const Tabs = {
        PurchasedBonds: "purchased-bonds",
        IssuedBonds: "issued-bonds",
        Watchlist: 'watchlist'

        // add watchilist as well
    }

    const Titles = {
        [Tabs.PurchasedBonds]: "Purchased Bonds",
        [Tabs.IssuedBonds]: "Issued Bonds",
        [Tabs.Watchlist]: "Watchlist"
    }

    const [tab, setTab] = useState(Tabs.PurchasedBonds)
    const isPurchased = tab === Tabs.PurchasedBonds;
    const isWatchlist = tab === Tabs.Watchlist;


    useEffect(() => {
        if (query.tab) setTab(query.tab.toString());
    }, [query]);

    const tabContent = (): ContractCoreDetails[] => {
        if (isPurchased) {
            const uniqueBonds: StringKeyedObject<ContractCoreDetails> = {};
            ((balances || []).forEach(item => uniqueBonds[item.bond.uri] = item.bond))
            return Object.values(uniqueBonds);
        } else if (isWatchlist) {
            return [];
        } else {
            return issued || []
        }
    }

    return (
        <div className='flex flex-col gap-4 w-full'>
            <div className='flex items-center w-full gap-2'>
                {Object.values(Tabs).map(value => (
                    <button className={`rounded-md px-4 p-2 ${value === tab ? "bg-neutral-800" : "bg-neutral-900 "}`}
                            key={value} onClick={() => setTab(value)}>
                        <span
                            className={`text-sm ${value === tab ? "text-white" : "text-neutral-400"}`}>{Titles[value]}</span>
                    </button>
                ))}
            </div>
            <div className='grid grid-cols-3 gap-2'>
                {
                    tabContent().map(item => <BondCard info={item} key={item.contractAddress}/>)
                }
            </div>

        </div>
    )
}
