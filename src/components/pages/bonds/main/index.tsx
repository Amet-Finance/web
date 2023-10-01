import Styles from "./index.module.css";
import BondsShowcase from "@/components/pages/bonds/main/components/bonds-showcase";
import Actions from "@/components/pages/bonds/main/components/actions";
import Statistics from "@/components/pages/bonds/main/components/statistics";


export default function Bonds() {
    return <>
        <main className={Styles.container}>
            <Actions/>
            <Statistics/>
            <BondsShowcase/>
        </main>
    </>
}
