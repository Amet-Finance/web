import NotFound from "@/components/pages/404";

export default function NotFoundPage() {
    return <NotFound/>
}

export function getStaticProps() {
    return {
        props: {
            pageId: "NotFoundPage"
        }
    }
}