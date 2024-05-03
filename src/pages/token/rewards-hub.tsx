import XpRewards from "@/components/pages/token/xp-rewards";
import {PageId} from "@/components/pages/constants";

export default function RewardsHub() {
    return <XpRewards/>
}

export function getStaticProps() {
    return {props: {pageId: PageId.RewardsHub}}
}
