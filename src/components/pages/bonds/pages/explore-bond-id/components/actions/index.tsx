import {ContractCoreDetails} from "@/modules/api/contract-type";
import {useEffect, useState} from "react";
import Image from "next/image"
import {getAccount} from "@wagmi/core";
import {ActionHeadlineComponent} from "@/components/pages/bonds/pages/explore-bond-id/components/actions/types";
import PurchaseTab from "@/components/pages/bonds/pages/explore-bond-id/components/actions/purchase";
import RedeemTab from "@/components/pages/bonds/pages/explore-bond-id/components/actions/redeem";
import ManageTab from "@/components/pages/bonds/pages/explore-bond-id/components/actions/manage";
import ReferralTab from "@/components/pages/bonds/pages/explore-bond-id/components/actions/referral";
import {ConditionalRenderer} from "@/components/utils/container";
import {ContractBalance} from "@/modules/api/type";
import {useBalances} from "@/modules/utils/address";
import {formatLargeNumber} from "@/modules/utils/numbers";

const Tabs = {
    Purchase: "Purchase",
    Redeem: "Redeem",
    Manage: "Manage",
    ReferralRewards: "Referral Rewards"
}

export default function ActionsContainer({contractInfo}: Readonly<{
    contractInfo: ContractCoreDetails
}>) {

    const [selected, setSelected] = useState(Tabs.Purchase);
    const selectionHandler = [selected, setSelected];

    return (
        <div className='relative xl:col-span-4 col-span-12 flex flex-col gap-2 justify-between rounded-3xl p-6 border border-neutral-900 w-full h-96'>
            <ActionsHeadline contractInfo={contractInfo} selectionHandler={selectionHandler}/>
            <div className='flex justify-center h-full w-full'>
                <TabSelector title={selected} contractInfo={contractInfo}/>
            </div>
        </div>
    )
}

function ActionsHeadline({contractInfo, selectionHandler}: Readonly<{
    contractInfo: ContractCoreDetails,
    selectionHandler: any
}>) {


    const {contractAddress, chainId, owner} = contractInfo;
    const [selected, setSelected] = selectionHandler;


    const {contractBalances} = useBalances({contractAddress})
    const total = formatLargeNumber(contractBalances.reduce((acc: number, value: ContractBalance) => acc += value.balance, 0));

    const components: ActionHeadlineComponent[] = [
        {
            title: "Purchase",
            type: Tabs.Purchase,
            icon: "/svg/images/purchase.svg"
        },
        {
            title: "Redeem",
            type: Tabs.Redeem,
            icon: "/svg/images/redeem.svg",
            addon: {
                total: total
            }
        },
        {
            title: "Manage",
            type: Tabs.Manage,
            icon: "/svg/images/manage.svg",
            addon: {
                onlyOwner: true
            }
        },
        {
            title: "Referral",
            type: Tabs.ReferralRewards,
            icon: "/svg/images/rewards.svg"
        },
    ]

    return (
        <div className='grid grid-cols-4 gap-2'>
            {
                components.map(component => <HeadlineComponent
                    component={{...component, addon: {...component.addon, owner: owner}}}
                    selected={selected}
                    key={component.type}
                    setSelected={setSelected}/>)
            }
        </div>
    )
}

function HeadlineComponent({component, selected, setSelected}: {
    component: ActionHeadlineComponent,
    selected: string,
    setSelected: any
}) {
    const {type, icon, title, addon} = component
    const {address} = getAccount();
    const isSelected = selected === type;

    const [isHide, setHide] = useState(true);
    const select = () => setSelected(type)

    useEffect(() => {

        const hide = addon?.onlyOwner && address && address?.toLowerCase() !== addon.owner?.toLowerCase()
        setHide(Boolean(hide))

    }, [address, addon]);

    if (isHide) return null;


    return (
        <button
            className={`flex flex-col items-center gap-1 py-1 hover:bg-neutral-900 rounded-md cursor-pointer ${isSelected && "bg-neutral-800"}`}
            onClick={select}>
            <div className='relative'>
                <Image src={icon} alt={title} width={24} height={24}/>
                <ConditionalRenderer isOpen={Boolean(addon?.total)}>
                    <div
                        className='absolute flex justify-center items-center px-1.5 bg-green-500 rounded-full -top-2.5 -right-3.5'>
                        <span className='text-mm text-white font-medium'>{addon?.total}</span>
                    </div>
                </ConditionalRenderer>
            </div>
            <span className='text-mm'>{title}</span>
        </button>
    )
}

// Unlocked Initially
// 100_000_000_000 - Community and Ecosystem
// 30_000_000_000 - Development and Future Operations
// 10_000_000_000 - Marketing and Partnerships
// 1_250_000_000 - Liquidity Provision


// IBO price in USD - $0.000012
// IBO offering - 0.96 USDC = 80000 $AMT = 3 months
// MC - $12_000_000
// FDV - $1_695_000

function TabSelector({title, contractInfo}: Readonly<{
    title: string,
    contractInfo: ContractCoreDetails
}>) {

    switch (title) {
        case Tabs.Purchase:
            return <PurchaseTab contractInfo={contractInfo}/>
        case Tabs.Redeem:
            return <RedeemTab contractInfo={contractInfo}/>
        case Tabs.Manage:
            return <ManageTab contractInfo={contractInfo}/>
        case Tabs.ReferralRewards:
            return <ReferralTab contractInfo={contractInfo}/>
        default:
            return null
    }
}


