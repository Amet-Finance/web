import ServerError from "@/components/pages/500";
import {PageId} from "@/components/pages/constants";

export default function ServerErrorPage() {
    return <ServerError/>
}

export function getStaticProps() {
    return {props: {pageId: PageId.ServerError}}
}
