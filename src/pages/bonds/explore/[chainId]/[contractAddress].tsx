import ExploreId from "@/components/pages/bonds/pages/explore-id";
import {getChain} from "@/modules/utils/wallet-connect";
import CloudAPI from "@/modules/cloud-api";
import {DetailedBondResponse} from "@/modules/cloud-api/type";

export default function ExploreIdPage({bondInfoDetailed}: { bondInfoDetailed: DetailedBondResponse }) {
    return <ExploreId bondInfoDetailed={bondInfoDetailed}/>
}

export async function getServerSideProps({query}: any) {

    const props: any = {
        pageId: "ExploreIdPage",
    }

    const contractAddress = query.contractAddress;
    const chain = getChain(query.chainId)


    if (chain && contractAddress) {

        const bondInfoDetailed = await CloudAPI.getBondDetailed({chainId: chain.id, _id: contractAddress});
        const {description} = bondInfoDetailed;

        const meta: { title?: string, description?: string } = {};

        if (Object.values(description).length) {

            meta.title = description.name

            const detailDescription = description?.details?.description;
            if (detailDescription && detailDescription.length > 5) {
                meta.description = detailDescription;
            }
        }

        props.bondInfoDetailed = {
            ...bondInfoDetailed,
            lastUpdated: Date.now()
        };
        props.meta = meta;
    }

    return {props}
}
