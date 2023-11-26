import {useState} from "react";
import {BondDescription, BondInfoDetailed} from "@/modules/web3/type";
import Manage from "@/components/pages/bonds/pages/explore-id/components/bond-actions/manage";
import Redeem from "@/components/pages/bonds/pages/explore-id/components/bond-actions/redeem";
import Purchase from "@/components/pages/bonds/pages/explore-id/components/bond-actions/purchase";
import ActionButtons from "@/components/pages/bonds/pages/explore-id/components/bond-actions/action-buttons";
import {TokensResponse} from "@/modules/cloud-api/type";

export const Actions: { [key: string]: string } = {
    Purchase: 'purchase',
    Redeem: 'redeem',
    Manage: 'manage'
}

export default function BondActions({info, tokens, bondDescription}: { info: BondInfoDetailed, tokens: TokensResponse, bondDescription: BondDescription }) {
    const [action, setAction] = useState(Actions.Purchase);
    const actionHandler = [action, setAction];

    return <>
        <div className="flex flex-col gap-5 bg-d-1 p-5 rounded-xl lg1:w-auto sm:w-full lg1:min-w-500">
            <ActionButtons info={info} actionHandler={actionHandler}/>
            <div className="h-px w-full bg-g5"/>
            <Action info={info} actionHandler={actionHandler} tokens={tokens} bondDescription={bondDescription}/>
        </div>
    </>
}

function Action({actionHandler, info, tokens, bondDescription}: any) {
    const [action] = actionHandler;

    switch (action) {
        case Actions.Purchase: {
            return <Purchase info={info} tokens={tokens}/>
        }
        case Actions.Redeem : {
            return <Redeem info={info} tokens={tokens}/>
        }
        case Actions.Manage: {
            return <Manage info={info} tokens={tokens} bondDescription={bondDescription}/>
        }
        default: {
            return <></>
        }
    }
}
