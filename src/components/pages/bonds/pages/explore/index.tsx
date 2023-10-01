import Styles from './index.module.css';
import SettingsSVG from "../../../../../../public/svg/settings";
import {useEffect, useState} from "react";
import * as CloudAPI from "@/modules/cloud-api";
import {BondInfo} from "@/components/pages/bonds/pages/issue/type";
import {shorten} from "@/modules/web3/utils/address";
import Link from "next/link";
import {getWeb3Instance} from "@/modules/web3";
import {BondInfoDetailed} from "@/modules/web3/type";
import {formatTime} from "@/modules/utils/dates";
import Bond from "@/components/pages/bonds/utils/bond";

export default function Explore() {
    return <>
        <div className={Styles.container}>
            <div className={Styles.texts}>
                <h1>Explore On-Chain Bonds: Find, Filter, and Invest</h1>
                <p className={Styles.secondary}>Discover a range of on-chain bonds through advanced filters and
                    intuitive search options.</p>
            </div>
            <input type="text" placeholder='Search by Contract Address, Issuer, or Token Pair'
                   className={Styles.search}/>
            <BondsContainer/>
        </div>
    </>
}

function BondsContainer() {

    const [bonds, setBonds] = useState({
        isLoading: false,
        data: [] as any
    })

    useEffect(() => {
        setBonds({
            ...bonds,
            isLoading: true
        });


        CloudAPI.getBonds()
            .then(res => {
                setBonds({
                    data: res,
                    isLoading: false
                })
            })
    }, [])
    return <>
        <div className={Styles.bonds}>
            <Settings/>
            <div className={Styles.bondsContainer}>
                {bonds.data.map((bond: BondInfo, index: number) => <Bond info={bond as any} key={index}/>)}
            </div>
            <ShowMore/>
        </div>
    </>
}

function ShowMore() {
    return <>
        <div className={Styles.showMore}>
            <span>Show More...</span>
        </div>
    </>
}

function Settings() {
    const [isOpen, setOpen] = useState(false);

    return <>
        <div className={Styles.settings}>
            {isOpen ?
                <>
                    <div className={Styles.settingsContainer}>
                        <select name="Currency" id="currency" className={Styles.select}>
                            <option value="USDT">USDT</option>
                            <option value="USDC">USDC</option>
                        </select>
                    </div>
                </> :
                <>
                    <span/>
                </>
            }
            <SettingsSVG onClick={() => setOpen(!isOpen)}/>
        </div>
    </>
}