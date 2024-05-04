import AddressId from "@/components/pages/address/address-id";
import GraphqlAPI from "@/modules/api/graphql";
import {defaultChain} from "@/modules/utils/wallet-connect";
import {AccountExtendedFormat} from "@/modules/api/contract-type";
import {PageId} from "@/components/pages/constants";
import AccountStore from "@/store/redux/account";
import CloudAPI from "@/modules/api/cloud";

export default function AddressPage({accountExtendedFormat}: Readonly<{ accountExtendedFormat: AccountExtendedFormat }>) {
    return <AddressId accountExtendedFormat={accountExtendedFormat}/>
}

export async function getServerSideProps({query}: any) {
    const holdings = await GraphqlAPI.getAccountInformation({address: query.id, chainId: defaultChain.id})
    const account = await CloudAPI.getUser(query.id);

    const accountExtendedFormat = {
        ...account,
        ...holdings
    }

    return {props: {accountExtendedFormat, pageId: PageId.AddressId}}
}
