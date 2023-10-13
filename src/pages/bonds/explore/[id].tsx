import ExploreId from "@/components/pages/bonds/pages/explore-id";

export default function ExploreIdPage({_id, chainId}: { _id: string, chainId: string }) {
    return <ExploreId _id={_id} chainId={chainId}/>
}

export async function getServerSideProps({query}: any) {
    return {
        props: {
            pageId: "ExploreIdPage",
            _id: query.id,
            chainId: query.chainId || null
        }
    }
}