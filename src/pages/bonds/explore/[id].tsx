import {getInfo} from "@/modules/web3/zcb";
import Explore from "@/components/pages/bonds/pages/explore-id";

export default function ExploreIdPage(props: any) {
    return <Explore props={props}/>
}

export async function getServerSideProps({query}: any) {
    const info = await getInfo(query.id);
    return {
        props: {
            _id: query.id,
            ...info
        }
    }
}