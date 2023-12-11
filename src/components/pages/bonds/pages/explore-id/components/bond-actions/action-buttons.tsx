import {useSelector} from "react-redux";
import {RootState} from "@/store/redux/type";
import {Actions} from "@/components/pages/bonds/pages/explore-id/components/bond-actions/index";
import {useAccount} from "wagmi";
import {useEffect, useRef, useState} from "react";
import SettingsSVG from "../../../../../../../../public/svg/utils/settings";
import {DetailedBondResponse} from "@/modules/cloud-api/type";

export default function ActionButtons({bondInfo, actionHandler}: { bondInfo: DetailedBondResponse, actionHandler: any }) {
    return <>
        <div className='flex justify-between'>
            <div className='flex gap-4 items-center'>
                {
                    Object.keys(Actions).map((key: string) => <ActionButton name={key}
                                                                            bondInfo={bondInfo}
                                                                            actionHandler={actionHandler}
                                                                            key={key}/>)
                }
            </div>
            <SettingsSection/>
        </div>
    </>
}

function ActionButton({name, bondInfo, actionHandler}: {
    name: string,
    bondInfo: DetailedBondResponse,
    actionHandler: any
}) {
    const {contractInfo} = bondInfo
    const {_id, chainId, issuer} = contractInfo;
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
    const boxRef = useRef<any>()
    const [isOpen, setOpen] = useState(false)
    useEffect(() => {
        const handleClickOutside = (event: Event) => {
            if (boxRef.current && !boxRef.current.contains(event.target)) {
                setOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [boxRef]);

    return <>
        <div className='relative' ref={boxRef}>
            <SettingsSVG onClick={() => setOpen(!isOpen)}/>
            {
                isOpen && <>
                    <div className='absolute top-[120%] right-0 flex flex-col border border-w1 py-2 bg-d-1 rounded'>
                        <span className='whitespace-nowrap px-4 cursor-pointer'>Report/Flag Bond</span>
                    </div>

                </>
            }
        </div>
    </>
}
