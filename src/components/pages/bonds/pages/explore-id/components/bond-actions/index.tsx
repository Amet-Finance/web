import {useState} from "react";
import Manage from "@/components/pages/bonds/pages/explore-id/components/bond-actions/manage";
import Redeem from "@/components/pages/bonds/pages/explore-id/components/bond-actions/redeem";
import Purchase from "@/components/pages/bonds/pages/explore-id/components/bond-actions/purchase";
import ActionButtons from "@/components/pages/bonds/pages/explore-id/components/bond-actions/action-buttons";
import {DetailedBondResponse} from "@/modules/cloud-api/type";

export const Actions: { [key: string]: string } = {
    Purchase: 'purchase',
    Redeem: 'redeem',
    Manage: 'manage'
}

export default function BondActions({bondInfo, refreshHandler}: { bondInfo: DetailedBondResponse, refreshHandler: any[] }) {
    const [action, setAction] = useState(Actions.Purchase);
    const actionHandler = [action, setAction];

    return <>
        <div className="flex flex-col gap-5 bg-d-1 p-5 rounded-xl lg1:w-auto sm:w-full lg1:min-w-500">
            <ActionButtons bondInfo={bondInfo} actionHandler={actionHandler}/>
            <div className="h-px w-full bg-g5"/>
            <Action bondInfo={bondInfo} actionHandler={actionHandler} refreshHandler={refreshHandler}/>
        </div>
    </>
}

function Action({actionHandler, bondInfo, refreshHandler}: any) {
    const [action] = actionHandler;

    switch (action) {
        case Actions.Purchase: {
            return <Purchase bondInfo={bondInfo} refreshHandler={refreshHandler} />
        }
        case Actions.Redeem : {
            return <Redeem bondInfo={bondInfo} refreshHandler={refreshHandler}/>
        }
        case Actions.Manage: {
            return <Manage bondInfo={bondInfo}/>
        }
        default: {
            return <></>
        }
    }
}
