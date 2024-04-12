import {URLS} from "@/modules/utils/urls";

const FOOTER_LINKS = [
    {
        title: "About Us",
        attributes: [
            {title: 'Terms Of Service', url: URLS.TermsOfService},
            {title: 'Privacy Policy', url: URLS.PrivacyPolicy},
            {title: 'Brand Assets', url: URLS.BrandAssets},
            {title: 'DefiLlama', url: URLS.DefiLlama},
        ]
    },
    {
        title: "Get Help",
        attributes: [
            {title: 'Status', url: URLS.StatusPage},
            {title: 'Contact Us', url: URLS.ContactUs},
            {title: 'FAQ', url: URLS.FAQ_INVESTOR},
        ]
    }
]

export {FOOTER_LINKS}
