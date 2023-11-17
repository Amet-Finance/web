import ExploreId from "@/components/pages/bonds/pages/explore-id";
import {getBondInfo, getBondName} from "@/modules/web3/zcb";
import {getChain} from "@/modules/utils/wallet-connect";

export default function ExploreIdPage({bondInfo}: any) {
    return <ExploreId bondInfoTmp={bondInfo}/>
}

export async function getServerSideProps({query}: any) {
    const chainId = query.chainId || null;
    const contractAddress = query.id
    const chain = getChain(chainId)
    let bondInfo;
    if (chain) {
        bondInfo = await getBondInfo(chain, contractAddress)
    }
    
    return {
        props: {
            pageId: "ExploreIdPage",
            bondInfo,
            meta: {
                title: "Bonds: " + await getBondName(chain, contractAddress) // todo make this request to S3/back-end
            }
        }
    }
}
