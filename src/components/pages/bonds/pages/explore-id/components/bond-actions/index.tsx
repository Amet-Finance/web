import {useEffect, useState} from "react";
import Styles from "./index.module.css";
import {getAllowance} from "@/modules/web3/tokens";
import {BondInfo} from "@/components/pages/bonds/pages/issue/type";
import {useSelector} from "react-redux";
import {Account} from "@/store/redux/account/type";
import {getWeb3Instance, submitTransaction} from "@/modules/web3";
import {TxTypes, WalletTypes} from "@/modules/web3/constants";
import {toBN} from "web3-utils";
import Loading from "@/components/utils/loading";
import {BondInfoDetailed, TokenInfo} from "@/modules/web3/type";
import {toast} from "react-toastify";
import {initBalance} from "@/store/redux/account";
import ClearSVG from "../../../../../../../../public/svg/clear";
import SelectAllSVG from "../../../../../../../../public/svg/select-all";
import {getTokensInfo} from "@/modules/web3/zcb";
import {formatTime} from "@/modules/utils/dates";
import {RootState} from "@/store/redux/type";
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