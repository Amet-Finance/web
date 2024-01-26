import {Article, Question} from "@/components/pages/main/types";
import {BondCardInfo} from "@/components/pages/bonds/utils/bond-card/type";

const ARTICLES: Article[] = [
    {
        title: "Social Authority As Collateral",
        href: "https://medium.com/@amet-finance/social-authority-as-collateral-b95594eccfd1",
        image: "https://miro.medium.com/v2/resize:fit:1400/format:webp/1*Kl5M9VjOrrAvlhSGApTXyg.png",
        date: "Nov 15, 2023",
        paragraph: 'In the financial system, we are all aware of the concept of collateral, which is currently only an item of value offered to secure a loan. But how does it differ in Amet Finance? We’ll figure it out soon.'
    },
    {
        title: "How to Ensure the Repayment of Bonds with Amet Finance",
        href: "https://medium.com/@amet-finance/how-to-ensure-the-repayment-of-bonds-with-amet-finance-50a1ff3f465c",
        image: "https://miro.medium.com/v2/resize:fit:1400/format:webp/1*T0ApvNFqHNBdtBVKDFwoPQ.png",
        date: "Nov 15, 2023",
        paragraph: 'At Amet Finance, our mission is to make decentralized finance more accessible and secure. We’ve developed the ZeroCouponBondsV1_AmetFinance contract, our first step in revolutionizing how bonds work in the DeFI world. This contract is designed to be user-friendly and safe, ensuring that you get the most out of your bonds.'
    },
    {
        title: "Demystifying Bonds: An Adventure into Finance… Amet Finance",
        href: "https://medium.com/@amet-finance/demystifying-bonds-an-adventure-into-finance-amet-finance-d988a4f1ad04",
        image: "/meta/amet-logo-black.jpg",
        date: "Oct 26, 2023",
        paragraph: 'Ever wondered what bonds are? Imagine you lend money to a friend, and they promise to give it back in a year, along with a little extra for your trust and support. Well, that’s kind of how bonds work! 💸'
    },
]

const FAQ_QUESTIONS: Question[] = [
    {
        title: "How does Amet Finance revolutionize bond trading in DeFi?",
        answer: "Amet Finance brings a novel approach to bond trading in DeFi by integrating traditional bond principles with blockchain technology, offering enhanced liquidity, lower transaction costs, and increased accessibility for diverse investors."
    },
    {
        title: "Can I earn passive income through Amet Finance?",
        answer: "Absolutely! By investing in bonds through Amet Finance, you can earn passive income. The platform offers various bonds with different maturity periods and interest rates, catering to different investment strategies."
    },
    {
        title: "What makes Amet Finance's approach to bond issuance unique?",
        answer: "Our platform stands out with its user-friendly interface for bond issuance, customizable bond parameters, and the integration of smart contract technology, ensuring a seamless and secure issuance process."
    },
    {
        title: "How does tokenization of bonds as NFTs benefit investors?",
        answer: "Tokenizing bonds as NFTs on Amet Finance allows for greater flexibility in trading, provides unique ownership rights, and opens up new markets for bond trading on NFT platforms, enhancing liquidity and investment opportunities."
    },
    {
        title: "What strategies can I employ for bond trading on Amet Finance?",
        answer: "Amet Finance supports various trading strategies, from long-term investment in stable bonds to active trading of bonds on secondary markets. Our platform provides the tools and data needed to make informed decisions."
    }
]

const BOND_CARDS: BondCardInfo[] = [
    {
        contractAddress: "0x1",
        chainId: 7001,

        investment: {
            contractAddress: "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
            "name": "USD Coin",
            "symbol": "USDC",
            "icon": "https://storage.amet.finance/icons/usdc.png",
            "decimals": 6,
            verified: true,
            amount: "10",
            amountClean: 10
        },
        interest: {
            contractAddress: "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
            "name": "USD Coin",
            "symbol": "USDC",
            "icon": "https://storage.amet.finance/icons/usdc.png",
            "decimals": 6,
            verified: true,
            amount: "10",
            amountClean: 15
        },

        total: 100,
        purchased: 50,
        redeemed: 20,

        maturityPeriod: 300,

        issuer: "0x21451254Fas124",
        issuanceDate: "24.01.2024",
        score: 8.9
    },
    {
        contractAddress: "0x1",
        chainId: 7001,

        investment: {
            contractAddress: "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
            "name": "Tether USD",
            "symbol": "USDT",
            "icon": "https://storage.amet.finance/icons/usdc.png",
            "decimals": 6,
            verified: true,
            amount: "10",
            amountClean: 1200
        },
        interest: {
            contractAddress: "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
            "name": "Solana",
            "symbol": "SOL",
            "icon": "https://storage.amet.finance/icons/solana.png",
            "decimals": 6,
            verified: true,
            amount: "10",
            amountClean: 20
        },

        total: 100,
        purchased: 80,
        redeemed: 25,

        maturityPeriod: 300,

        issuer: "0x32AC51254FDe3",
        issuanceDate: "24.01.2024",
        score: 9.2
    },
    {
        contractAddress: "0x1",
        chainId: 7001,

        investment: {
            contractAddress: "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
            "name": "Tether USD",
            "symbol": "USDT",
            "icon": "https://storage.amet.finance/icons/usdc.png",
            "decimals": 6,
            verified: true,
            amount: "10",
            amountClean: 200
        },
        interest: {
            contractAddress: "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
            "name": "Shiba Inu",
            "symbol": "SHIB",
            "icon": "https://storage.amet.finance/icons/shib.png",
            "decimals": 6,
            verified: true,
            amount: "10",
            amountClean: 31350000
        },

        total: 100,
        purchased: 10,
        redeemed: 0,

        maturityPeriod: 120000,

        issuer: "0x32AC51254FDe3",
        issuanceDate: "24.01.2024",
        score: 9.8
    }
]

export {
    ARTICLES,
    FAQ_QUESTIONS,
    BOND_CARDS
}