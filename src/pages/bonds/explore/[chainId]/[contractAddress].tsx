import ExploreId from "@/components/pages/bonds/pages/explore-id";
import {getChain} from "@/modules/utils/wallet-connect";
import CloudAPI from "@/modules/cloud-api";
import {DetailedBondResponse} from "@/modules/cloud-api/type";
import ExploreBondId from "@/components/pages/bonds/pages/explore-bond-id";
import {BondDetailed} from "@/components/pages/bonds/pages/explore-bond-id/type";
import {undefined} from "zod";

// {bondInfoDetailed}: { bondInfoDetailed: DetailedBondResponse }
export default function ExploreIdPage() {
    const bondInfoDetailed: BondDetailed = {
        contractDescription: {
            name: "USDT-BTC | Amet Finance",
            description: "Bond valuation is a technique for determining the theoretical fair value of a particular bond. Bond valuation includes calculating the present value of a bond's future interest payments.",
            external_url: "https://www.investopedia.com/terms/b/bond-valuation.asp",
            image: "https://www.investopedia.com/terms/b/bond-valuation.asp"
        },
        contractInfo: {
            contractAddress: "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
            chainId: 80001,
            issuer: "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
            total: 150,
            purchased: 30,
            redeemed: 7,
            maturityPeriod: 2413,
            investment: {
                contractAddress: "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
                "name": "Tether USD",
                "symbol": "USDT",
                "icon": "https://storage.amet.finance/icons/usdc.png",
                "decimals": 6,
                verified: true,
                amount: "10",
                amountClean: 400
            },
            interest: {
                contractAddress: "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
                "name": "Bitcoin",
                "symbol": "BTC",
                "icon": "https://storage.amet.finance/icons/bitcoin.png",
                "decimals": 6,
                verified: true,
                amount: "100000",
                amountClean: 10,
            },
            isSettled: false,
            purchaseFeePercentage: 5,
            earlyRedemptionFeePercentage: 2.5,
            issuanceBlock: 21455125,
            issuanceDate: new Date()
        },
        contractStats: {
            score: 7.1,
            securedPercentage: 25.3,
            issuerScore: 8,
            uniqueHolders: 1502,
            tbv: 124410
        },
        lastUpdated: new Date()
    }
    return <ExploreBondId bondDetailed={bondInfoDetailed}/>
}

export async function getServerSideProps({query}: any) {

    const props: any = {
        pageId: "ExploreIdPage",
    }

    const contractAddress = query.contractAddress;
    const chain = getChain(query.chainId)


    if (chain && contractAddress) {

        // const bondInfoDetailed = await CloudAPI.getBondDetailed({chainId: chain.id, _id: contractAddress});
        // const {description} = bondInfoDetailed;
        //
        // const meta: { title?: string, description?: string } = {};
        //
        // if (Object.values(description).length) {
        //
        //     meta.title = description.name
        //
        //     const detailDescription = description?.details?.description;
        //     if (detailDescription && detailDescription.length > 5) {
        //         meta.description = detailDescription;
        //     }
        // }
        //
        // props.bondInfoDetailed = {
        //     ...bondInfoDetailed,
        //     lastUpdated: Date.now()
        // };
        // props.meta = meta;
    }

    return {props}
}
