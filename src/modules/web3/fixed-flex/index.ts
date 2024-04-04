import {Chain} from "wagmi";
import {ActionLogFormat} from "@/components/pages/bonds/pages/explore-bond-id/type";
import {LogTypes} from "@/modules/web3/fixed-flex/constants";
import {FixedFlexBondController, ProviderController, constants} from "amet-utils";
import {BigNumber} from "ethers";

async function purchaseBlocks(chain: Chain, contractAddress: string, tokenId: number | string): Promise<BigNumber> {
    const instance = FixedFlexBondController.getBondInstance(chain.id, contractAddress);
    return await instance.purchaseBlocks([Number(tokenId)]);
}

async function getTransferActivity(chain: Chain, contractAddress: string, fromBlock: number, toBlock: number): Promise<ActionLogFormat[]> {

    const {provider} = new ProviderController(chain.id);
    const bondContract = FixedFlexBondController.getBondInstance(chain.id, contractAddress);

    const logs = await provider.getLogs({
        address: contractAddress,
        fromBlock: Number(fromBlock),
        toBlock: Number(toBlock)
    })

    const logsById: { [txId: string]: ActionLogFormat } = {}

    logs.forEach(log => {
        const parseLog = bondContract.interface.parseLog(log);
        if (
            parseLog.name === bondContract.interface.events["TransferSingle(address,address,address,uint256,uint256)"].name ||
            parseLog.name === bondContract.interface.events["TransferBatch(address,address,address,uint256[],uint256[])"].name) {

            const operator = parseLog.args[0];
            const from = parseLog.args[1] || "";
            const to = parseLog.args[2] || "";
            const ids = parseLog.args[3] || [];
            const counts = parseLog.args[4] || [];

            const totalCount = Array.isArray(counts) ? counts.reduce((acc: bigint, item: bigint) => acc + item, BigInt(0)) : counts

            let type = LogTypes.Transfer;
            if (from.toLowerCase() === constants.AddressZero.toLowerCase()) {
                type = LogTypes.Purchase
            } else if (to.toLowerCase() === constants.AddressZero.toLowerCase()) {
                type = LogTypes.Redeem
            }

            const logFormatted = {
                from: from || "",
                to: to || "",
                block: Number(log.blockNumber),
                hash: log.transactionHash,
                type: type,
                count: Number(totalCount)
            }
            if (!logsById[logFormatted.hash]) {
                logsById[logFormatted.hash] = logFormatted
            } else {
                logsById[logFormatted.hash].count += logFormatted.count;
            }
        }
    })

    return Object.values(logsById);
}

const FixedFlexController = {
    purchaseBlocks,
    getTransferActivity
}

export default FixedFlexController;
