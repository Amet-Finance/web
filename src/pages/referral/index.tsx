import Referral from "@/components/referral";

export default function ReferralPage() {
    return <Referral/>
}

export function getStaticProps() {
    return {
        props: {
            pageId: "ReferralPage"
        }
    }
}
