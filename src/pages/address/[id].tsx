import AddressId from "@/components/pages/address/address-id";
import GraphqlAPI from "@/modules/api/graphql";
import {defaultChain} from "@/modules/utils/wallet-connect";
import {AccountExtendedFormat} from "@/modules/api/contract-type";
import {PageId} from "@/components/pages/constants";

export default function AddressPage({accountExtendedFormat}: { accountExtendedFormat: AccountExtendedFormat }) {
    return <AddressId accountExtendedFormat={accountExtendedFormat}/>
}

export async function getServerSideProps({query}: any) {
    const accountExtendedFormat = await GraphqlAPI.getAccountInformation({address: query.id, chainId: defaultChain.id})

    return {props: {accountExtendedFormat, pageId: PageId.AddressId}}
}
