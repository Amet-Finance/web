import AddressId from "@/components/pages/address/address-id";

export default function AddressPage({address}: any) {
    return <AddressId address={address}/>
}

export async function getServerSideProps({query}: any) {
    return {
        props: {
            address: query.id,
            pageId: "ExplorePage"
        }
    }
}
