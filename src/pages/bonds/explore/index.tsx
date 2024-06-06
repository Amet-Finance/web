import Explore from "@/components/pages/bonds/pages/explore";
import {PageId} from "@/components/pages/constants";
import {UrlQuery} from "@/modules/api/contract-type";
import {getChain} from "@/modules/utils/chain";
import {GetServerSidePropsContext} from "next";
import {MetaInfo} from "@/components/headers/types";

export default function ExplorePage({config}: { config: UrlQuery }) {
    return <Explore config={config}/>
}

export async function getServerSideProps({query}: GetServerSidePropsContext) {

    const props: { pageId: string, config: UrlQuery, meta?: MetaInfo } = {
        pageId: PageId.ExplorePage,
        config: {}
    }


    const chain = getChain(query.chainId?.toString());

    if (chain?.id) {
        props.config.chainId = chain.id;
        props.meta = {
            title: `Explore Top On-Chain Bonds on ${chain.name} | Amet Finance`,
            description: `Browse through top on-chain bonds offered by Amet Finance. Discover the best investment opportunities in a decentralized finance environment on ${chain.name}.`,
        }
    }
    if (query.purchaseToken) props.config.purchaseToken = query.purchaseToken.toString().toLowerCase();
    if (query.payoutToken) props.config.payoutToken = query.payoutToken.toString().toLowerCase();

    return {props}
}
