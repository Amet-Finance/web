import Explore from "@/components/pages/bonds/pages/explore";
import {PageId} from "@/components/pages/constants";

export default function ExplorePage() {
    return <Explore/>
}

export function getStaticProps() {
    return {
        props: {pageId: PageId.ExplorePage}
    }
}
