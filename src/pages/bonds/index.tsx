import Bonds from "@/components/pages/bonds/main";
import {PageId} from "@/components/pages/constants";

export default function BondsPage() {
    return <Bonds/>
}

export function getStaticProps() {
    return {props: {pageId: PageId.BondsPage}}
}
