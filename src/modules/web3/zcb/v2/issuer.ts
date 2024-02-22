import {Chain} from "wagmi";
import {getProvider, trackTransaction} from "@/modules/web3";
import {encodeFunctionData, getContract, isAddress} from "viem";
import {ZCB_ISSUER_CONTRACTS} from "@/modules/web3/constants";
import ZCB_Issuer_ABI from "@/modules/web3/abi-jsons/ZCB_Issuer.json";
import {toast} from "react-toastify";
import BigNumber from "bignumber.js";
import {TokensResponse} from "@/modules/cloud-api/type";
import {BondInfoForIssuance} from "@/components/pages/bonds/pages/issue/type";

function getIssuerContractInstance(chain: Chain) {
    const provider = getProvider(chain)
    return getContract({
        address: ZCB_ISSUER_CONTRACTS[chain.id] as any,
        abi: ZCB_Issuer_ABI,
        publicClient: provider
    })
}

function issueBonds(chain: Chain, bondInfo: BondInfoForIssuance, tokens: TokensResponse) {
    console.log(bondInfo)
    // for total and etc... check uint40
    const investmentTokenInfo = tokens[bondInfo.investmentToken]
    const interestTokenInfo = tokens[bondInfo.interestToken]
    const investmentAmount = BigNumber(bondInfo.investmentAmount).times(BigNumber(10).pow(BigNumber(investmentTokenInfo.decimals)))
    const interestAmount = BigNumber(bondInfo.interestAmount).times(BigNumber(10).pow(BigNumber(interestTokenInfo.decimals)))

    const issuerContract = ZcbIssuerController.getIssuerContractInstance(chain)
    return encodeFunctionData({
        abi: issuerContract.abi,
        functionName: 'issueBondContract',
        args: [
            bondInfo.total,
            bondInfo.maturityPeriod,
            bondInfo.investmentToken,
            BigInt(`0x${investmentAmount.toString(16)}`),
            bondInfo.interestToken,
            BigInt(`0x${interestAmount.toString(16)}`)
        ]
    })
}

const ZcbIssuerController = {
    getIssuerContractInstance,
    issueBonds
}
export default ZcbIssuerController
