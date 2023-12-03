import {BondInfoDetailed} from "@/modules/web3/type";
import {useSelector} from "react-redux";
import {RootState} from "@/store/redux/type";
import {Actions} from "@/components/pages/bonds/pages/explore-id/components/bond-actions/index";
import {useAccount} from "wagmi";
import {useEffect, useState} from "react";
import SettingsSVG from "../../../../../../../../public/svg/utils/settings";

export default function ActionButtons({info, actionHandler}: any) {
    return <>
        <div className='flex justify-between'>
            <div className='flex gap-4 items-center'>
                {
                    Object.keys(Actions).map((key: string) => <ActionButton name={key}
                                                                            info={info}
                                                                            actionHandler={actionHandler}
                                                                            key={key}/>)
                }
            </div>
            <SettingsSection/>
        </div>
    </>
}

function ActionButton({name, info, actionHandler}: { name: string, info: BondInfoDetailed, actionHandler: any }) {
    const {_id, chainId, issuer} = info;
    const [show, setShow] = useState(false);

    const [action, setAction] = actionHandler;
    const {address} = useAccount();
    const {balance} = useSelector((item: RootState) => item.account);
    const [buttonText, setButtonText] = useState(name)

    const isIssuer = issuer.toLowerCase() === address?.toLowerCase()
    const isSelected = Actions[name] === action;
    const className = isSelected ? "text-white" : "text-g";

    const select = () => setAction(Actions[name])

    useEffect(() => {
        if (Actions[name] === Actions.Redeem) {
            const contractAddress = _id.toLowerCase() || ""
            const balanceTokenIds = balance[chainId]?.[contractAddress] || [];
            const nameTmp = name + `(${balanceTokenIds.length})`;
            setButtonText(nameTmp);
            setShow(true);
        } else if (Actions[name] === Actions.Manage) {
            const hideManage = Boolean(Actions[name] === Actions.Manage && !isIssuer && address && issuer);
            setShow(!hideManage);
        } else {
            setShow(true)
        }


    }, [balance, _id, chainId, name])

    if (!show) {
        return null;
    }

    return <>
        <button className={className} onClick={select}>{buttonText}</button>
    </>
}


function SettingsSection() {
    const [isOpen, setOpen] = useState(false)

    return <>
        <div className='relative'>
            <SettingsSVG onClick={() => setOpen(!isOpen)}/>
            {
                isOpen && <>
                    <div className='absolute top-[120%] right-0 flex flex-col border border-w1 py-2 bg-d-1 rounded'>
                        <span className='whitespace-nowrap px-4 cursor-pointer'>Add NFT to wallet</span>
                        <span className='whitespace-nowrap px-4 cursor-pointer'>Explore issuer</span>
                    </div>

                </>
            }
        </div>
    </>
}
