import {useState} from "react";
import Styles from "./index.module.css";
import {BondInfoDetailed} from "@/modules/web3/type";
import Manage from "@/components/pages/bonds/pages/explore-id/components/bond-actions/manage";
import Redeem from "@/components/pages/bonds/pages/explore-id/components/bond-actions/redeem";
import Purchase from "@/components/pages/bonds/pages/explore-id/components/bond-actions/purchase";
import ActionButtons from "@/components/pages/bonds/pages/explore-id/components/bond-actions/action-buttons";

export const Actions: { [key: string]: string } = {
    Purchase: 'purchase',
    Redeem: 'redeem',
    Manage: 'manage'
}

export default function BondActions({info, tokens}: { info: BondInfoDetailed, tokens: any }) {
    const [action, setAction] = useState(Actions.Purchase);
    const actionHandler = [action, setAction];

    return <>
        <div className={Styles.bondActions}>
            <ActionButtons info={info} actionHandler={actionHandler}/>
            <Action info={info} actionHandler={actionHandler} tokens={tokens}/>
        </div>
    </>
}

function Action({actionHandler, info, tokens}: any) {
    const [action, setAction] = actionHandler;

    switch (action) {
        case Actions.Purchase: {
            return <Purchase info={info} tokens={tokens}/>
        }
        case Actions.Redeem : {
            return <Redeem info={info} tokens={tokens}/>
        }
        case Actions.Manage: {
            return <Manage info={info} tokens={tokens}/>
        }
        default: {
            return <></>
        }
    }
}