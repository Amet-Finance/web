import {getChain} from "@/modules/utils/wallet-connect";
import ExploreBondId from "@/components/pages/bonds/pages/explore-bond-id";
import {ContractExtendedFormat} from "@/modules/api/contract-type";
import {ExploreIdQueryParams} from "@/components/pages/bonds/pages/explore-bond-id/type";
import Graphql from "@/modules/api/graphql";
import {PageId} from "@/components/pages/constants";
import {MetaConstants} from "@/components/headers/constants";

export default function ExploreIdPage({bondInfoDetailed, queryParams}: Readonly<{
    bondInfoDetailed: ContractExtendedFormat,
    queryParams: ExploreIdQueryParams
}>) {
    return <ExploreBondId bondDetailedTmp={bondInfoDetailed} queryParams={queryParams}/>
}

export async function getServerSideProps({query}: any) {

    const props: any = {
        pageId: PageId.ExploreIdPage,
        queryParams: {
            contractAddress: query.contractAddress,
            chainId: query.chainId,
        }
    }

    const contractAddress = query.contractAddress;
    const chain = getChain(query.chainId)


    if (chain && contractAddress) {
        const contract = await Graphql.getContractExtended({
            chainId: chain.id,
            contractAddress: contractAddress
        });
        if (contract) {
            const {contractDescription, contractInfo} = contract;

            props.bondInfoDetailed = contract;
            props.meta = {
                title: contractDescription?.name || MetaConstants[PageId.ExploreIdPage].title,
                description: contractDescription?.details?.description ?? MetaConstants[PageId.ExploreIdPage].description,
            };
        }
    }

    return {props}
}
