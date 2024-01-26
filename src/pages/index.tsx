import Home from "@/components/pages/main";
import {PageId} from "@/components/pages/constants";

export default function HomePage() {
    return <Home/>
}

export function getStaticProps() {
    return {
        props: {
            pageId: PageId.MainPage,
        }
    }
}
