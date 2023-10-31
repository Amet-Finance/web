import Styles from "@/components/pages/bonds/pages/explore-id/components/bond-actions/index.module.css";
import {BondInfoDetailed} from "@/modules/web3/type";
import {useSelector} from "react-redux";
import {RootState} from "@/store/redux/type";
import {Actions} from "@/components/pages/bonds/pages/explore-id/components/bond-actions/index";
import {useAccount} from "wagmi";

export default function ActionButtons({info, actionHandler}: any) {
    return <>
        <div className='flex gap-4 items-center'>
            {
                Object.keys(Actions)
                    .map((key: string) => <ActionButton name={key}
                                                        info={info}
                                                        actionHandler={actionHandler}
                                                        key={key}/>)
            }
        </div>
    </>
}

function ActionButton({name, info, actionHandler}: { name: string, info: BondInfoDetailed, actionHandler: any }) {
    const [action, setAction] = actionHandler;
    const account = useSelector((item: RootState) => item.account);
    const {address} = useAccount()
    const isSelected = Actions[name] === action;
    const className = isSelected ? "text-white" : "text-g"
    const select = () => setAction(Actions[name])

    const showName = () => {
        let nameTmp = name;
        if (Actions[name] === Actions.Redeem) {
            const contractAddress = info._id?.toLowerCase() || ""
            const balanceTokenIds = account.balance[contractAddress] || [];
            nameTmp += `(${balanceTokenIds.length})`;
        }

        return nameTmp;
    }

    const isIssuer = info.issuer.toLowerCase() === address?.toLowerCase()
    if (Actions[name] === Actions.Manage && !isIssuer) {
        return null;
    }

    return <>
        <button className={className} onClick={select}>{showName()}</button>
    </>
}
