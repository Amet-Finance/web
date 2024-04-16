import {URLS} from "@/modules/utils/urls";

const FOOTER_LINKS = [
    {
        title: "Explore",
        attributes: [
            {title: 'DefiLlama', url: URLS.DefiLlama},
            {title: 'DappRadar', url: URLS.DappRadar},
        ]
    },
    {
        title: "About Us",
        attributes: [
            {title: 'Terms Of Service', url: URLS.TermsOfService},
            {title: 'Privacy Policy', url: URLS.PrivacyPolicy},
            {title: 'Brand Assets', url: URLS.BrandAssets},
            {title: 'Careers', url: URLS.LinkedIn},
        ]
    },
    {
        title: "Get Help",
        attributes: [
            {title: 'Status', url: URLS.StatusPage},
            {title: 'Contact Us', url: URLS.ContactUs},
            {title: 'Bug Bounty', url: URLS.BugBounty},
            {title: 'FAQ', url: URLS.FAQ_INVESTOR},
        ]
    }
]

export {FOOTER_LINKS}
