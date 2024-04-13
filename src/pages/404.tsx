import NotFound from "@/components/pages/404";
import {PageId} from "@/components/pages/constants";

export default function NotFoundPage() {
    return <NotFound/>
}

export function getStaticProps() {
    return {props: {pageId: PageId.NotFoundPage}}
}
