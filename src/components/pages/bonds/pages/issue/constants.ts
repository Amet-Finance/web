import {URLS} from "@/modules/utils/urls";

const BondTokenInfo = {
    Investment: 'PurchaseToken',
    Interest: 'interestToken'
}

const InfoSections = {
    Total: {
        text: "The total number of bonds to issue",
        link: URLS.FAQ_IOB,
        isBlank: true
    },
    MaturityPeriod: {
        text: "The duration after which bonds can be redeemed.",
        link: URLS.FAQ_IOB,
        isBlank: true
    },
    Chain: {
        text: "The chain where the bonds should be issued",
        link: URLS.FAQ_IOB,
        isBlank: true
    },
    PurchaseToken: {
        text: "The contract address of the purchase token.",
        link: URLS.FAQ_IOB,
        isBlank: true
    },
    PayoutToken: {
        text: "The contract address of the payout token.",
        link: URLS.FAQ_IOB,
        isBlank: true
    },
    PurchaseAmount: {
        text: "The price per bond in the purchase token.",
        link: URLS.FAQ_IOB,
        isBlank: true
    },
    PayoutAmount: {
        text: "The total return per bond in the payout token.",
        link: URLS.FAQ_IOB,
        isBlank: true
    },
    Type: {
        text: "The bond type. Zero Coupon Bonds (ZCB) have no periodic interest payments; interest is paid at bond redemption.",
        link: URLS.FAQ_ZCB,
        isBlank: true
    },
    Settled: {
        text: "\"Settled\" indicates that the issuer cannot increase the bond supply, and the full payout for available bonds (totalBonds - redeemed) is secured within the contract. This ensures bond safety and guarantees for holders and future purchasers."
    }
}

export {
    BondTokenInfo,
    InfoSections
}
