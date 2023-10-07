import Styles from './index.module.css';
import SettingsSVG from "../../../../../../public/svg/settings";
import {useEffect, useState} from "react";
import {BondInfo} from "@/components/pages/bonds/pages/issue/type";
import Bond from "@/components/pages/bonds/utils/bond";
import {Staatliches} from "next/font/google";
import {join} from "@/modules/utils/styles";
import {getBondsHandler} from "@/components/pages/bonds/utils/bond/functions";

const staatliches = Staatliches({subsets: ['latin'], weight: "400"})

export default function Explore() {
    return <>
        <div className={Styles.container}>
            <div className={Styles.texts}>
                <h1 className={join([Styles.headline, staatliches.className])}>
                    Explore On-Chain <span className={Styles.secondary}>Bonds</span>: <br/> Find, Filter, and Invest
                </h1>
                <hr className={Styles.line}/>
                <p className={Styles.secondary}>Discover a range of on-chain bonds through advanced filters and
                    intuitive search options.</p>
            </div>
            <BondsContainer/>
        </div>
    </>
}

function BondsContainer() {

    const [bonds, setBonds] = useState({
        isLoading: false,
        limit: 20,
        skip: 0,
        data: [] as any
    })

    const bondsHandler = [bonds, setBonds]

    useEffect(() => {
        const interval = getBondsHandler(bondsHandler);
        return () => {
            clearInterval(interval)
        }

    }, [])
    return <>
        <div className={Styles.bonds}>
            <Settings/>
            <div className={Styles.bondsContainer}>
                {bonds.data.map((bond: BondInfo, index: number) => <Bond info={bond as any} key={index}/>)}
            </div>
            {Boolean(bonds.data < bonds.limit) && <ShowMore/>}
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
                        <input type="text" placeholder='Search by Contract Address, Issuer, or Token Pair'
                               className={Styles.search}/>
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