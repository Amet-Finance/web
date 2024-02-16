import {ExploreIdQueryParams} from "@/components/pages/bonds/pages/explore-bond-id/type";
import {getChain} from "@/modules/utils/wallet-connect";
import {isAddress} from "viem";
import {toast} from "react-toastify";
import ContractAPI from "@/modules/cloud-api/contract-api";
import {ContractExtendedFormat} from "@/modules/cloud-api/contract-type";

async function fetchContractExtended(queryParams: ExploreIdQueryParams): Promise<ContractExtendedFormat | undefined> {
    const chain = getChain(queryParams.chainId);

    if (!chain || !isAddress(queryParams.contractAddress)) {
        toast.error("Contract address or Chain id is invalid. Please check the url!")
        return;
    }

    const contracts = await ContractAPI.getContractsExtended({
        chainId: queryParams.chainId,
        contractAddresses: [queryParams.contractAddress]
    })

    if (!contracts || !contracts.length) {
        toast.error("External API error. Refreshing in 5sec.")
        return;
    }

    return contracts[0]
}

export {
    fetchContractExtended
}
