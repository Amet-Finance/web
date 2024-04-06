import {ExploreIdQueryParams} from "@/components/pages/bonds/pages/explore-bond-id/type";
import {getChain} from "@/modules/utils/wallet-connect";
import {isAddress} from "viem";
import {toast} from "react-toastify";
import {ContractExtendedFormat} from "@/modules/api/contract-type";
import Graphql from "@/modules/api/graphql";


async function fetchContractExtended(queryParams: ExploreIdQueryParams): Promise<ContractExtendedFormat | null> {
    const chain = getChain(queryParams.chainId);

    if (!chain || !isAddress(queryParams.contractAddress)) {
        toast.error("Contract address or Chain id is invalid. Please check the url!")
        return null;
    }

    return await Graphql.getContractExtended({
        chainId: queryParams.chainId,
        contractAddresses: [queryParams.contractAddress]
    })
}

function copyReferralCode(address: string|undefined) {
    if (!address) {
        return open();
    }

    const url = `${location.href.toLowerCase()}?ref=${address.toLowerCase()}`
    navigator.clipboard.writeText(url)
        .then(() => toast("Referral url was successfully copied to your clipboard."))
        .catch(() => toast.error("An error has occurred."))
}

export {
    copyReferralCode,
    fetchContractExtended
}
