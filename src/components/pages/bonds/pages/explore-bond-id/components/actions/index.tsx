import {ContractExtendedInfoFormat} from "@/modules/cloud-api/contract-type";
import {useAccount} from "wagmi";
import {useEffect, useState} from "react";
import {Balance} from "@/components/pages/bonds/pages/explore-bond-id/type";
import CloudAPI from "@/modules/cloud-api";
import {UPDATE_INTERVAL} from "@/components/pages/bonds/pages/explore-bond-id/constants";
import Image from "next/image"
import {getAccount} from "@wagmi/core";
import {ActionHeadlineComponent} from "@/components/pages/bonds/pages/explore-bond-id/components/actions/types";
import PurchaseTab from "@/components/pages/bonds/pages/explore-bond-id/components/actions/purchase";
import RedeemTab from "@/components/pages/bonds/pages/explore-bond-id/components/actions/redeem";
import ManageTab from "@/components/pages/bonds/pages/explore-bond-id/components/actions/manage";
import ReferralTab from "@/components/pages/bonds/pages/explore-bond-id/components/actions/referral";

const Tabs = {
    Purchase: "Purchase",
    Redeem: "Redeem",
    Manage: "Manage",
    ReferralRewards: "Referral Rewards"
}

export default function ActionsContainer({contractInfo}: { contractInfo: ContractExtendedInfoFormat }) {

    const {address} = useAccount();

    const [balance, setBalance] = useState({} as Balance);
    const [selected, setSelected] = useState(Tabs.Purchase);
    const selectionHandler = [selected, setSelected];



    // todo can optimize here as well, get only for that _id
    useEffect(() => {
        const getBalances = () => {
            if (address) {
                CloudAPI.getBalance(address)
                    .then(response => {
                        if (response?.[contractInfo._id]) {
                            setBalance({
                                [contractInfo._id]: response[contractInfo._id]
                            })
                        }
                    })
            }
        }

        getBalances();
        const interval = setInterval(getBalances, UPDATE_INTERVAL);
        return () => clearInterval(interval);
    }, [address, contractInfo._id]);




    return <>
        <div
            className='relative lg:col-span-4 sm:col-span-12 flex flex-col justify-between rounded-3xl p-8 py-4  border border-neutral-900 w-full h-full'>
            <ActionsHeadline contractId={contractInfo._id} owner={contractInfo.owner} balance={balance}
                             selectionHandler={selectionHandler}/>
            <div className='flex w-full h-full'>
                <TabSelector title={selected} contractInfo={contractInfo} balance={balance}/>
            </div>
        </div>
    </>
}

function ActionsHeadline({contractId, owner, balance, selectionHandler}: {
    contractId: string,
    owner: string,
    balance: Balance,
    selectionHandler: any
}) {

    const [selected, setSelected] = selectionHandler;
    const total = Object.values(balance[contractId] || {}).reduce((acc: number, value: number) => acc += value, 0);

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

function TabSelector({title, contractInfo, balance}: {
    title: string,
    contractInfo: ContractExtendedInfoFormat,
    balance: Balance
}) {

    switch (title) {
        case Tabs.Purchase:
            return <PurchaseTab contractInfo={contractInfo}/>
        case Tabs.Redeem:
            return <RedeemTab contractInfo={contractInfo} balance={balance}/>
        case Tabs.Manage:
            return <ManageTab contractInfo={contractInfo}/>
        case Tabs.ReferralRewards:
            return <ReferralTab contractInfo={contractInfo}/>
        default:
            return <></>
    }
}


