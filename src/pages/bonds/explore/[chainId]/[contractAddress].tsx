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

    const contractAddress = query.contractAddress;
    const chain = getChain(query.chainId)
    const defaultBondInfo = {
        _id: contractAddress,
        chainId: chain?.id
    }

    if (chain && contractAddress) {
        const bondInfoPromise = getBondInfo(chain, contractAddress);
        const bondDescriptionPromise = CloudAPI.getContractDetails(contractAddress);
        const [bondInfoTmp, bondDescriptionTmp] = await Promise.allSettled([bondInfoPromise, bondDescriptionPromise])

        const bondInfo = bondInfoTmp.status === "fulfilled" && bondInfoTmp.value ? bondInfoTmp.value : defaultBondInfo;
        const bondDescription = bondDescriptionTmp.status === "fulfilled" && bondDescriptionTmp.value ? bondDescriptionTmp.value : {};
        const meta: { title?: string, description?: string } = {};

        if (Object.values(bondDescription).length) {

            meta.title = bondDescription?.name

            const description = bondDescription?.details?.description;
            if (description && typeof description === "string" && description.length > 5) {
                meta.description = description;
            }
        }

        props.bondInfo = bondInfo;
        props.bondDescription = bondDescription;
        props.meta = meta;
    }

    return {props}
}
