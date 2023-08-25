import Styles from './index.module.css';
import SettingsSVG from "../../../../../../public/svg/settings";
import {useState} from "react";

export default function Explore() {
    return <>
        <div className={Styles.container}>
            <div className={Styles.texts}>
                <h1>Explore On-Chain Bonds: Find, Filter, and Invest</h1>
                <p className={Styles.secondary}>Discover a range of on-chain bonds through advanced filters and intuitive search options.</p>
            </div>
            <input type="text" placeholder='Search by Contract Address, Issuer, or Token Pair' className={Styles.search}/>
            <BondsContainer/>
        </div>
    </>
}

function BondsContainer() {
    const bonds = [1, 2, 4, 421, 421, 4, 21, 42, 4, 12, 421, 42, 1421, 1, 1, 1, 1, 1, 2, 2, 21,]
    return <>
        <div className={Styles.bonds}>
            <Settings/>
            <div className={Styles.bondsContainer}>
                {bonds.map((bond, index) => <Bond key={index}/>)}
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

function Bond() {
    return <>
        <div className={Styles.bond}>

        </div>
    </>
}