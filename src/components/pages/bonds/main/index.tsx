import Styles from "./index.module.css";
import BondsShowcase from "@/components/pages/bonds/main/components/bonds-showcase";
import Actions from "@/components/pages/bonds/main/components/actions";
import Statistics from "@/components/pages/bonds/main/components/statistics";
import LearnMore from "@/components/pages/bonds/main/components/learn-more";

export default function Bonds() {
    return <>
        <main className={Styles.container}>
            <div className={Styles.section}>
                <Actions/>
                <Statistics/>
            </div>
            <BondsShowcase/>
            <LearnMore/>
        </main>
    </>
}
