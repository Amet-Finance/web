import {URLS} from "@/modules/utils/urls";

const InfoDetails: {
    [key: string]: {
        title: string,
        url: string
    }
} = {
    Investment: {
        title: "This is the amount you'll need to invest in the bond. It's the quantity of the Investment Token required to acquire a bond. Click to see more!",
        url: URLS.FAQ_WAB
    },
    Interest: {
        title: "The Interest Amount represents the quantity of the Interest Token you'll receive upon redeeming the bond. It's your reward for holding the bond until the redemption lock period expires. Click to see more!",
        url: URLS.FAQ_WAB
    },
    RedeemLockPeriod: {
        title: "The Redeem Lock Period is the duration after which you can redeem your bond with interest. This period ensures the security and integrity of the bond's terms. Click to see more!",
        url: URLS.FAQ_WAB
    }
}


export {
    InfoDetails
}