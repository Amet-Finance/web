import {Chain} from "wagmi";
import {getProvider} from "@/modules/web3";
import {getContract} from "viem";
import AmetVaultABI from "@/modules/web3/abi-jsons/AmetVault.json";

function getVaultContractInstance(chain: Chain, vaultAddress: `string`|any) {
    const provider = getProvider(chain)
    return getContract({
        address: vaultAddress,
        abi: AmetVaultABI,
        publicClient: provider
    })
}

const AmetVaultController = {
    getVaultContractInstance,
}
export default AmetVaultController
