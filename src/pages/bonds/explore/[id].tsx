import {getInfo} from "@/modules/web3/zcb";
import ExploreId from "@/components/pages/bonds/pages/explore-id";

export default function ExploreIdPage(props: any) {
    return <ExploreId props={props}/>
}

export async function getServerSideProps({query}: any) {
    const props = await getInfo(query.id);
    return {
        props: {
            ...props,
            pageId: "ExploreIdPage"
        }
    }
}