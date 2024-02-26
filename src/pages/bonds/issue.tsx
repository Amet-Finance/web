import Issue from "@/components/pages/bonds/pages/issue";
import {PageId} from "@/components/pages/constants";

export default function IssuePage() {
    return <Issue/>
}

export function getStaticProps() {
    return {props: {pageId: PageId.IssuePage}}
}
