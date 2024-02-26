import {Chain} from "wagmi";
import {getProvider} from "@/modules/web3";
import {getContract} from "viem";
import VAULT_ABI from "@/modules/web3/fixed-flex/v2/abi-jsons/Vault.json";

function getVaultContractInstance(chain: Chain, vaultAddress: `string`|any) {
    const provider = getProvider(chain)
    return getContract({
        address: vaultAddress,
        abi: VAULT_ABI,
        publicClient: provider
    })
}

const AmetVaultController = {
    getVaultContractInstance,
}
export default AmetVaultController
