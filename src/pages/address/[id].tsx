import AddressId from "@/components/pages/address/address-id";
import GraphqlAPI from "@/modules/api/graphql";
import {defaultChain} from "@/modules/utils/wallet-connect";
import {AccountExtendedFormat} from "@/modules/api/contract-type";
import {PageId} from "@/components/pages/constants";
import AccountStore from "@/store/redux/account";
import CloudAPI from "@/modules/api/cloud";

export default function AddressPage({accountExtendedFormat}: Readonly<{
    accountExtendedFormat: AccountExtendedFormat
}>) {
    return <AddressId accountExtendedFormat={accountExtendedFormat}/>
}

export async function getServerSideProps({query}: any) {
    const address = query.id;
    const holdings = await GraphqlAPI.getAccountInformation({address, chainId: defaultChain.id})
    const account = await CloudAPI.getUser(address);

    const accountExtendedFormat = {
        ...account,
        ...holdings
    }

    return {
        props: {
            accountExtendedFormat,
            pageId: PageId.AddressId,
            meta: {
                title: `Account Explorer - Manage Your Profile & Investments | Address: ${address.toLowerCase()} | Amet Finance`
            }
        }
    }
}
