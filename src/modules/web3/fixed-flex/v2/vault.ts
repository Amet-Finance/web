import {Chain} from "wagmi";
import {getProvider} from "@/modules/web3";
import {encodeFunctionData, getContract} from "viem";
import VAULT_ABI from "@/modules/web3/fixed-flex/v2/abi-jsons/Vault.json";
import FixedFlexIssuerController from "@/modules/web3/fixed-flex/v2/issuer";
import {ReferralInfo} from "@/components/pages/bonds/pages/explore-bond-id/components/actions/types";
import {BondFeeDetails} from "@/modules/web3/fixed-flex/v2/types";

function getVaultContractInstance(chain: Chain, vaultAddress: `string`|any) {
    const provider = getProvider(chain)
    return getContract({
        address: vaultAddress,
        abi: VAULT_ABI,
        publicClient: provider
    })
}

async function getVault(chain: Chain) {
    const issuerContract = FixedFlexIssuerController.getIssuerContractInstance(chain);
    const vaultAddress = await issuerContract.read.vault();
    return getVaultContractInstance(chain, vaultAddress);
}

async function getReferralRewards(chain: Chain, vaultAddress: string, bondAddress: string, referrer: string): Promise<ReferralInfo> {
    const vaultContract = getVaultContractInstance(chain, vaultAddress);
    const results: any = await vaultContract.read.getReferrerData([bondAddress, referrer])

    return {
        quantity: results.quantity,
        isRepaid: results.isRepaid
    }
}

async function isAddressRestricted(chain: Chain, vaultAddress: string, referrer: string): Promise<boolean> {
    const vaultContract = getVaultContractInstance(chain, vaultAddress);
    return await vaultContract.read.isAddressRestricted([referrer]) as boolean;
}

async function getBondFeeDetails(chain: Chain, vaultAddress: string, bondAddress: string): Promise<BondFeeDetails> {
    const vaultContract = getVaultContractInstance(chain, vaultAddress);
    return await vaultContract.read.getBondFeeDetails([bondAddress]) as any;
}

function claimReferralRewards(chain: Chain, vaultAddress: string, bondAddress: string): `0x${string}` {
    const vaultContract = getVaultContractInstance(chain, vaultAddress);

    return encodeFunctionData({
        abi: vaultContract.abi,
        functionName: 'claimReferralRewards',
        args: [bondAddress]
    })
}

const FixedFlexVaultController = {
    getVaultContractInstance,
    getVault,
    getReferralRewards,
    claimReferralRewards,
    getBondFeeDetails,
    isAddressRestricted
}
export default FixedFlexVaultController
