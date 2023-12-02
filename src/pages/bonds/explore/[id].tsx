import ExploreId from "@/components/pages/bonds/pages/explore-id";
import {getBondInfo} from "@/modules/web3/zcb";
import {getChain} from "@/modules/utils/wallet-connect";
import {requestAPI} from "@/modules/cloud-api/util";
import CloudAPI from "@/modules/cloud-api";

export default function ExploreIdPage({bondInfo, bondDescription}: any) {
    console.log(`bondInfo, bondDescription`, bondInfo, bondDescription)
    return <ExploreId bondInfoTmp={bondInfo} bondDescription={bondDescription || {}}/>
}

export async function getServerSideProps({query}: any) {

    const props: any = {
        pageId: "ExploreIdPage",
    }

    const chainId = query.chainId || null;
    const contractAddress = query.id
    const chain = getChain(chainId)

    if (chain && contractAddress) {
        props.bondInfo = await getBondInfo(chain, contractAddress)
        props.bondDescription = await CloudAPI.getContractDetails(contractAddress)
        if (props.bondDescription) {
            props.meta = {
                title: props.bondDescription.name
            }
        }
    }

    return {props}
}
