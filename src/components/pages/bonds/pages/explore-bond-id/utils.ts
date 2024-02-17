import {ExploreIdQueryParams, LogFormat} from "@/components/pages/bonds/pages/explore-bond-id/type";
import {getChain} from "@/modules/utils/wallet-connect";
import {isAddress} from "viem";
import {toast} from "react-toastify";
import ContractAPI from "@/modules/cloud-api/contract-api";
import {ContractExtendedFormat, ContractExtendedInfoFormat} from "@/modules/cloud-api/contract-type";
import {getProvider} from "@/modules/web3";
import {getTransferActivity} from "@/modules/web3/zcb";
import {ZERO_ADDRESS} from "@/modules/web3/constants";
import BigNumber from "bignumber.js";

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

async function getPastLogs(contractInfo: ContractExtendedInfoFormat, setLogs: any): Promise<LogFormat[]> {

    const {_id, issuanceBlock, investment, purchased} = contractInfo;
    const [contractAddress, chainId] = _id.toLowerCase().split("_");
    const chain = getChain(chainId);

    if (!chain) return [];

    const LogTypes = {
        Purchase: "Purchase",
        Redeem: "Redeem",
        Transfer: "Transfer"
    }


    const provider = getProvider(chain);
    const blockNumber = await provider.getBlockNumber();
    const FIXED_BLOCK = BigInt(1000)

    const combinedLogs: LogFormat[] = []
    for (let block = blockNumber; block > 0;) {
        const fromBlock = block - FIXED_BLOCK
        const logs = await getTransferActivity(chain, contractAddress, fromBlock, block)
        block = fromBlock;
        if (fromBlock < BigInt(issuanceBlock)) {
            break;
        }

        logs.forEach(log => {
            const operator = log.args[0]
            const from = log.args[1] || ""
            const to = log.args[2] || ""
            const ids = log.args[3] || []
            const counts = log.args[4] || []

            let type;
            let value;
            if (from.toLowerCase() === ZERO_ADDRESS.toLowerCase()) {
                type = LogTypes.Purchase
                const totalCount = Array.isArray(counts) ? counts.reduce((acc: bigint, item: bigint) => acc += item, BigInt(0)) : counts
                const totalValue = BigNumber(totalCount.toString()).times(BigNumber(investment.amountClean))
                value = `${totalValue.toString()} ${investment.symbol}`
            } else if (to.toLowerCase() === ZERO_ADDRESS.toLowerCase()) {
                type = LogTypes.Redeem
                value = ""
            } else {
                type = LogTypes.Transfer
                value = ""
            }

            const logObject: LogFormat = {
                from: from || "",
                to: to || "",
                block: Number(log.blockNumber),
                hash: log.transactionHash,
                type: type,
                value: value,
            }

            combinedLogs.push(logObject)
        })

        if (combinedLogs.length) {
            setLogs([...combinedLogs]);
            if (combinedLogs.length === purchased) break;
        }

    }

    return combinedLogs;
}

export {
    fetchContractExtended,
    getPastLogs
}
