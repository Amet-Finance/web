import Issue from "@/components/pages/bonds/pages/issue";

export default function IssuePage() {
    return <Issue/>
}

export function getStaticProps() {
    return {
        props: {
            pageId: "IssuePage"
        }
    }
}
