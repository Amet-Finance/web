import {URLS} from "@/modules/utils/urls";

const NAV_ITEMS: { title: string, defaultUrl: string, defaultTarget?: string, links?: { url: string, name: string }[] }[] = [
    {
        title: "Bonds",
        defaultUrl: "/bonds",
        links: [
            {
                url: '/bonds/issue',
                name: "Issue"
            },
            {
                url: '/bonds/explore',
                name: "Explore"
            },

        ]
    },
    {
        title: "Documentation",
        defaultUrl: URLS.Docs,
        defaultTarget: "_blank"
    }
]

export {
    NAV_ITEMS
}
