import AddressId from "@/components/pages/address/address-id";
import GraphqlAPI from "@/modules/api/graphql";

export default function AddressPage({address}: any) {
    return <AddressId address={address}/>
}

export async function getServerSideProps({query}: any) {
    // GraphqlAPI.getAccountInformation({address: query.id})

    return {
        props: {
            address: query.id,
            pageId: "ExplorePage"
        }
    }
}
