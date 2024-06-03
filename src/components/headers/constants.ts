import {URLS} from "@/modules/utils/urls";
import {StringKeyedObject} from "@/components/utils/types";
import {PageId} from "@/components/pages/constants";
import {MetaInfo} from "@/components/headers/types";


const MetaConstants: StringKeyedObject<MetaInfo> = {
    [PageId.IssuePage]: {
        title: "Issue On-Chain Bonds Seamlessly | Amet Finance",
        description: "Create and issue on-chain bonds with ease using Amet Finance. Tailor your financial instruments for maximum impact in the decentralized finance landscape."
    },
    [PageId.BondsPage]: {
        title: "Invest in On-Chain Bonds - Secure & Transparent | Amet Finance",
        description: "Explore secure and transparent on-chain bonds on Amet Finance. Invest wisely in the future of decentralized finance with trusted on-chain solutions."
    },
    [PageId.ExplorePage]: {
        title: "Explore Top On-Chain Bonds | Amet Finance",
        description: "Browse through top on-chain bonds offered by Amet Finance. Discover the best investment opportunities in a decentralized finance environment."
    },
    [PageId.AddressId]: {
        title: "Account Explorer - Manage Your Profile & Investments | Amet Finance",
        description: "Utilize the Amet Finance Account Explorer to manage your profile, track your purchased and issued bonds, and monitor your watchlist. Access your connected social accounts and contact details, ensuring comprehensive management of your financial activities."
    },
    [PageId.RewardsHub]: {
        title: "Earn Rewards at the Rewards Hub | Amet Finance",
        description: "Participate in Amet Finance’s Rewards Hub and start earning XP today! Engage in rewarding activities and unlock exclusive benefits as you explore the world of decentralized finance."
    },
    [PageId.NotFoundPage]: {
        title: "Page Not Found | Amet Finance",
        description: "The page you are looking for doesn’t exist. Explore Amet Finance for leading on-chain bond solutions and innovative financial services."
    },
    [PageId.ServerError]: {
        title: "Internal Server Error | Amet Finance",
        description: "We are currently experiencing technical issues. Please try again later or contact Amet Finance support for assistance."
    },

    // Mostly not used
    [PageId.ExploreIdPage]: {
        title: "Detailed Bond Insights | Amet Finance",
        description: "Delve into detailed insights on Amet Finance’s on-chain bonds. Understand investment terms, security features, and potential returns."
    },
    default: {
        title: "Leading On-Chain Bonds Platform | Amet Finance",
        description: "Join Amet Finance to explore the possibilities of on-chain bonds and decentralized finance. Secure, transparent, and innovative financial solutions await you.",
        ogImage: URLS.OgImage
    }
}


export {MetaConstants}
