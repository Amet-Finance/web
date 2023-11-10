import {BondInfoDetailed} from "@/modules/web3/type";
import {useSelector} from "react-redux";
import {RootState} from "@/store/redux/type";
import {Actions} from "@/components/pages/bonds/pages/explore-id/components/bond-actions/index";
import {useAccount} from "wagmi";
import {useEffect, useState} from "react";

export default function ActionButtons({info, actionHandler}: any) {
    return <>
        <div className='flex gap-4 items-center'>
            {
                Object.keys(Actions).map((key: string) => <ActionButton name={key}
                                                                        info={info}
                                                                        actionHandler={actionHandler}
                                                                        key={key}/>)
            }
        </div>
    </>
}

function ActionButton({name, info, actionHandler}: { name: string, info: BondInfoDetailed, actionHandler: any }) {
    const {_id, chainId, issuer} = info;

    const [action, setAction] = actionHandler;
    const {address} = useAccount();
    const {balance} = useSelector((item: RootState) => item.account);
    const [buttonText, setButtonText] = useState(name)

    const isIssuer = issuer.toLowerCase() === address?.toLowerCase()
    const isSelected = Actions[name] === action;
    const className = isSelected ? "text-white" : "text-g"

    const select = () => setAction(Actions[name])

    useEffect(() => {
        if (Actions[name] === Actions.Redeem) {
            const contractAddress = _id.toLowerCase() || ""
            const balanceTokenIds = balance[chainId]?.[contractAddress] || [];
            const nameTmp = name + `(${balanceTokenIds.length})`;
            setButtonText(nameTmp)
        }
    }, [balance, _id, chainId, name])


    if (Actions[name] === Actions.Manage && !isIssuer && address) {
        return null;
    }

    return <>
        <button className={className} onClick={select}>{buttonText}</button>
    </>
}
