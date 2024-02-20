const UPDATE_INTERVAL = 25000

const STATISTICS_DEFINITION = {
    BondScore: {
        text: "A 1-10 rating calculated using a formula that factors in the secured percentage of interest, issuer's reliability, asset verification status, and the diversity of bond holders. It provides a quick assessment of the bond's quality."
    },
    SecuredPercentage: {
        text: "The fraction of the bond's interest that is securely locked in the contract, indicating the bond's reliability."
    },
    IssuerScore: {
        text: "A 1-10 score based on the percentage of bonds issued, sold, redeemed, and resold, reflecting the issuer's performance and reliability."
    },
    UniqueHolders: {
        text: "The total number of different entities or individuals holding the bond, indicating its popularity and trustworthiness in the market."
    }
}

export {UPDATE_INTERVAL, STATISTICS_DEFINITION}
