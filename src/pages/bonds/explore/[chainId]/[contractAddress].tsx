import {getChain} from "@/modules/utils/wallet-connect";
import ExploreBondId from "@/components/pages/bonds/pages/explore-bond-id";
import {BondDetailed} from "@/components/pages/bonds/pages/explore-bond-id/type";
import {ContractExtendedFormat} from "@/modules/cloud-api/contract-type";
import ContractAPI from "@/modules/cloud-api/contract-api";

// {bondInfoDetailed}: { bondInfoDetailed: DetailedBondResponse }
export default function ExploreIdPage({bondInfoDetailed}: {bondInfoDetailed: ContractExtendedFormat}) {
    return <ExploreBondId bondDetailed={bondInfoDetailed}/>
}

export async function getServerSideProps({query}: any) {

    const props: any = {
        pageId: "ExploreIdPage",
    }

    const contractAddress = query.contractAddress;
    const chain = getChain(query.chainId)


    if (chain && contractAddress) {

        const contracts = await ContractAPI.getContractsExtended({chainId: chain.id, contractAddresses: [contractAddress]});
        console.log(chain, contractAddress)
        console.log(contracts)
        if(!contracts || !contracts.length) return {props}


        const bondInfoDetailed = contracts[0]
        const {contractDescription} = bondInfoDetailed;

        const meta: { title?: string, description?: string } = {};

        if (Object.values(contractDescription).length) {

            meta.title = contractDescription.name

            const detailDescription = contractDescription?.details?.description;
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
