import Issue from "@/components/pages/bonds/pages/issue";
import {PageId} from "@/components/pages/constants";
import {GetServerSidePropsContext} from "next";
import {UrlQuery} from "@/modules/api/contract-type";
import {MetaInfo} from "@/components/headers/types";
import {getChain} from "@/modules/utils/chain";

export default function IssuePage({config}: { config: UrlQuery }) {
    return <Issue config={config}/>
}

export function getServerSideProps({query}: GetServerSidePropsContext) {

    const props: { pageId: string, config: UrlQuery, meta?: MetaInfo } = {
        pageId: PageId.IssuePage,
        config: {}
    }

    const chain = getChain(query.chainId?.toString());

    if (chain?.id) {
        props.config.chainId = chain.id;
        props.meta = {
            title: `Issue On-Chain Bonds Seamlessly on ${chain.name} | Amet Finance`,
            description: `Create and issue on-chain bonds with ease using Amet Finance on ${chain.name}. Tailor your financial instruments for maximum impact in the decentralized finance landscape.`,
        }
    }
    if (query.purchaseToken) props.config.purchaseToken = query.purchaseToken.toString().toLowerCase();
    if (query.payoutToken) props.config.payoutToken = query.payoutToken.toString().toLowerCase();

    return {props}
}
