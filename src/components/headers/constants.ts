import {URLS} from "@/modules/utils/urls";

type MetaInfo = {
    title: string,
    description: string,
    ogImage?: string
}

const MetaConstants: { [key: string]: MetaInfo } = {
    "NotFoundPage": {
        title: "Amet Finance - Page Not Found",
        description: "Oops! You've reached a page that doesn't exist on Amet Finance. Please check the URL or explore our other offerings."
    },
    "IssuePage": {
        title: "Amet Finance - Issue On-Chain Bonds",
        description: "Easily issue on-chain bonds with Amet Finance. Customize your bond and join the world of decentralized finance."
    },
    "BondsPage": {
        title: "Amet Finance - On-Chain Bonds",
        description: "Discover and invest in on-chain bonds with Amet Finance. Your gateway to decentralized finance."
    },
    "ExploreIdPage": {
        title: "Amet Finance - Bond Details",
        description: "Get detailed information about an on-chain bond on Amet Finance. Understand the security, terms, and investment opportunities."
    },
    "ExplorePage": {
        title: "Amet Finance - Explore On-Chain Bonds",
        description: "Explore a world of on-chain bonds with Amet Finance. Find the right investment opportunities for your financial future."
    },
    "AddressPage": {
        title: "Amet Finance - Wallet Address",
        description: "Explore your wallet address and transactions on Amet Finance. Securely track your financial activities with us."
    },
    default: {
        title: "Amet Finance - Empowering Your Financial Future in DeFi",
        description: "Unlock limitless opportunities with Amet Finance. Join us to explore on-chain bonds and embrace the decentralized future of finance.",
        ogImage: URLS.OgImage
    }
}

export {MetaConstants}