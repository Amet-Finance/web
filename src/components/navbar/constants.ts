import {LinkExtendedType} from "@/components/navbar/types";
import {URLS} from "@/modules/utils/urls";

const NAV_LINKS: LinkExtendedType[] = [
    {
        title: "Bonds",
        href: "/bonds",
        subLinks: [
            {title: "Issue", href: "/bonds/issue"},
            {title: "Explore", href: "/bonds/explore"}
        ]
    },
    {
        title: "Rewards Hub",
        href: "/token/rewards-hub",
    },
    {
        title: "Documents",
        href: URLS.Docs,
        target: "_blank"
    }
]

export {
    NAV_LINKS
}
