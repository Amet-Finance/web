import {BondInfoDetailed, TokenInfo} from "@/modules/web3/type";
import Styles from "@/components/pages/bonds/pages/explore-id/components/bond-actions/index.module.css";

export default function Manage({info, tokens}: { info: BondInfoDetailed, tokens: { [key: string]: TokenInfo } }) {
    return <>
        <div className={Styles.manage}>
            <button className={Styles.button}>Deposit</button>
            <button className={Styles.button}>Withdraw Remaining</button>
            <button className={Styles.button}>Change Owner</button>
            <button className={Styles.button}>Issue bonds</button>
            <button className={Styles.button}>Burn bonds</button>
        </div>
    </>
}