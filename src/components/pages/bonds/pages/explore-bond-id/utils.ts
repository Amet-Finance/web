import {ActionLogFormat, ExploreIdQueryParams} from "@/components/pages/bonds/pages/explore-bond-id/type";
import {getChain} from "@/modules/utils/wallet-connect";
import {isAddress} from "viem";
import {toast} from "react-toastify";
import ContractAPI from "@/modules/cloud-api/contract-api";
import {ContractExtendedFormat, ContractExtendedInfoFormat} from "@/modules/cloud-api/contract-type";
import {getProvider} from "@/modules/web3";
import {sleep} from "@/modules/utils/dates";
import FixedFlexController from "@/modules/web3/fixed-flex/v2";


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

async function getPastLogs(contractInfo: ContractExtendedInfoFormat, setLogs: any, setLoading: any): Promise<ActionLogFormat[]> {

    const {_id, issuanceBlock} = contractInfo;
    const [contractAddress, chainId] = _id.toLowerCase().split("_");
    const chain = getChain(chainId);

    if (!chain) return [];

    setLoading(true)
    const provider = getProvider(chain);
    const blockNumber = await provider.getBlockNumber();
    const FIXED_BLOCK = BigInt(1000)

    const combinedLogs: ActionLogFormat[] = []
    for (let block = blockNumber; block > 0;) {
        const fromBlock = block - FIXED_BLOCK
        await sleep(1000);
        const logs = await FixedFlexController.getTransferActivity(chain, contractAddress, fromBlock, block)
        block = fromBlock;

        if (logs.length) {
            combinedLogs.push(...logs);
            setLogs([...combinedLogs].sort((a, b) => b.block - a.block));
        }

        if (fromBlock < BigInt(issuanceBlock)) {
            break;
        }
    }

    setLoading(false)

    return combinedLogs;
}

export {
    fetchContractExtended,
    getPastLogs
}
