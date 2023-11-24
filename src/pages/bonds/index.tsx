import Bonds from "@/components/pages/bonds/main";

export default function BondsPage() {
    return <Bonds/>
}

export function getStaticProps() {
    return {
        props: {
            pageId: "BondsPage"
        }
    }
}
