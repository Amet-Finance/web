import Explore from "@/components/pages/bonds/pages/explore";

export default function ExplorePage() {
    return <Explore/>
}

export function getStaticProps() {
    return {
        props: {
            pageId: "ExplorePage"
        }
    }
}