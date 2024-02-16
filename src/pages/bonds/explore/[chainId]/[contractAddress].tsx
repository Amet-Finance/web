import {getChain} from "@/modules/utils/wallet-connect";
import ExploreBondId from "@/components/pages/bonds/pages/explore-bond-id";
import {ContractExtendedFormat} from "@/modules/cloud-api/contract-type";
import ContractAPI from "@/modules/cloud-api/contract-api";
import {ExploreIdQueryParams} from "@/components/pages/bonds/pages/explore-bond-id/type";

export default function ExploreIdPage({bondInfoDetailed, queryParams}: {bondInfoDetailed: ContractExtendedFormat, queryParams: ExploreIdQueryParams}) {
    return <ExploreBondId bondDetailedTmp={bondInfoDetailed} queryParams={queryParams}/>
}

export async function getServerSideProps({query}: any) {

    const props: any = {
        pageId: "ExploreIdPage",
        queryParams: {
            contractAddress: query.contractAddress,
            chainId: query.chainId,
        }
    }

    const contractAddress = query.contractAddress;
    const chain = getChain(query.chainId)


    if (chain && contractAddress) {

        const contracts = await ContractAPI.getContractsExtended({chainId: chain.id, contractAddresses: [contractAddress]});
        if(!contracts || !contracts.length) return {props}


        const bondInfoDetailed = contracts[0]
        const {contractDescription} = bondInfoDetailed;

        const meta: { title?: string, description?: string } = {};

        if (Object.values(contractDescription).length) {

            meta.title = contractDescription.name

            const detailDescription = contractDescription?.details?.description;
            if (detailDescription && detailDescription.length > 5) meta.description = detailDescription;
        }

        props.bondInfoDetailed = bondInfoDetailed;
        props.meta = meta;
    }

    return {props}
}
