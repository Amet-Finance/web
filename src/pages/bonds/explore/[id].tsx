import ExploreId from "@/components/pages/bonds/pages/explore-id";
import {getBondInfo} from "@/modules/web3/zcb";
import {getChain} from "@/modules/utils/wallet-connect";
import CloudAPI from "@/modules/cloud-api";

export default function ExploreIdPage({bondInfo, bondDescription}: any) {
    return <ExploreId bondInfoTmp={bondInfo} bondDescription={bondDescription || {}}/>
}

export async function getServerSideProps({query}: any) {

    const props: any = {
        pageId: "ExploreIdPage",
    }

    const contractAddress = query.id
    const chain = getChain(query.chainId)
    const defaultBondInfo = {
        _id: contractAddress,
        chainId: chain?.id
    }

    if (chain && contractAddress) {
        const bondInfoPromise = getBondInfo(chain, contractAddress);
        const bondDescriptionPromise = CloudAPI.getContractDetails(contractAddress);
        const [bondInfo, bondDescription] = await Promise.allSettled([bondInfoPromise, bondDescriptionPromise])

        props.bondInfo = bondInfo.status === "fulfilled" && bondInfo.value ? bondInfo.value : defaultBondInfo;
        props.bondDescription = bondDescription.status === "fulfilled" && bondDescription.value ? bondDescription.value : {}

        if (Object.values(props.bondDescription).length) {
            props.meta = {
                title: props.bondDescription?.name
            }
        }
    }

    return {props}
}
