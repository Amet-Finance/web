const UPDATE_INTERVAL = 25000

const STATISTICS_DEFINITION = {
    BondScore: {
        text: "A 1-10 rating calculated using a formula that factors in the secured percentage of payout, settled status, asset verification status, and the yield rate. It provides a quick assessment of the bond's quality."
    },
    SecuredPercentage: {
        text: "The fraction of the bond's interest that is securely locked in the contract, indicating the bond's reliability."
    },
    Volume: {
        text: "Aggregate USD value of all bonds purchased and redeemed"
    },
    FixedYieldRate: {
        text: "The yield rate represents the percentage return investors receive upon bond redemption, calculated based on the bond's purchase price and the payout at maturity, irrespective of the annualization or the underlying asset's price fluctuations"
    }
}

export {UPDATE_INTERVAL, STATISTICS_DEFINITION}
