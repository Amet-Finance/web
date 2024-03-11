import {ContractExtendedInfoFormat} from "@/modules/cloud-api/contract-type";
import {useEffect, useState} from "react";
import Image from "next/image"
import {getAccount} from "@wagmi/core";
import {ActionHeadlineComponent} from "@/components/pages/bonds/pages/explore-bond-id/components/actions/types";
import PurchaseTab from "@/components/pages/bonds/pages/explore-bond-id/components/actions/purchase";
import RedeemTab from "@/components/pages/bonds/pages/explore-bond-id/components/actions/redeem";
import ManageTab from "@/components/pages/bonds/pages/explore-bond-id/components/actions/manage";
import ReferralTab from "@/components/pages/bonds/pages/explore-bond-id/components/actions/referral";
import {useSelector} from "react-redux";
import {RootState} from "@/store/redux/type";

const Tabs = {
    Purchase: "Purchase",
    Redeem: "Redeem",
    Manage: "Manage",
    ReferralRewards: "Referral Rewards"
}

export default function ActionsContainer({contractInfo}: { contractInfo: ContractExtendedInfoFormat }) {

    const [selected, setSelected] = useState(Tabs.Purchase);
    const selectionHandler = [selected, setSelected];

    return <>
        <div
            className='relative lg:col-span-4 sm:col-span-12 flex flex-col justify-between rounded-3xl p-6  border border-neutral-900 w-full h-full'>
            <ActionsHeadline contractInfo={contractInfo} selectionHandler={selectionHandler}/>
            <div className='flex w-full h-full py-4'>
                <TabSelector title={selected} contractInfo={contractInfo}/>
            </div>
        </div>
    </>
}

function ActionsHeadline({contractInfo, selectionHandler}: {
    contractInfo: ContractExtendedInfoFormat,
    selectionHandler: any
}) {


    const {_id, owner} = contractInfo;
    const [selected, setSelected] = selectionHandler;


    const balances = useSelector((item: RootState) => item.account).balances;
    const contractBalances = balances[_id] || {};
    const total = Object.values(contractBalances).reduce((acc: number, value: number) => acc += value, 0);

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

    return <>
        <div className='grid grid-cols-4 gap-2'>
            {
                components.map(component => <HeadlineComponent
                    component={{...component, addon: {...component.addon, owner: owner}}}
                    selected={selected}
                    key={component.type}
                    setSelected={setSelected}/>)
            }
        </div>
    </>
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


    useEffect(() => {

        const hide = addon?.onlyOwner && address && address?.toLowerCase() !== addon.owner?.toLowerCase()
        setHide(Boolean(hide))

    }, [address, addon]);

    if (isHide) return null;

    return <>
        <div
            className={`flex flex-col justify-end gap-1 items-center hover:bg-neutral-800 p-1.5 rounded-md cursor-pointer ${isSelected && "bg-neutral-700"}`}
            onClick={() => setSelected(type)}>
            <div className='relative'>
                <Image src={icon} alt={title} width={24} height={24}/>
                {
                    Number.isFinite(addon?.total) &&
                    <>
                        <div
                            className='absolute flex justify-center items-center px-1 bg-green-500 rounded-full -top-1.5 -right-3'>
                            <span className='text-mm text-white font-medium'>{addon?.total}</span>
                        </div>
                    </>
                }
            </div>
            <span className='text-mm'>{title}</span>
        </div>
    </>
}

function TabSelector({title, contractInfo}: { title: string, contractInfo: ContractExtendedInfoFormat, }) {

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
            return <></>
    }
}


