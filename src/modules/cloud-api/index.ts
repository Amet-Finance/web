import {requestAPI} from "@/modules/cloud-api/util";
import {API_URL} from "@/modules/cloud-api/constants";
import {TokensResponse} from "@/modules/cloud-api/type";
import {TokenResponseDetailed} from "@/modules/web3/type";

async function getBalance(address: string): Promise<{[contractId: string]: {[id: string]: number}}> {
    const balanceAPI = `${API_URL}/v1/balance/${address}`
    const response = await requestAPI({
        url: balanceAPI
    });
    return response?.data;
}

async function getTokens({params}: {
    params: { chainId: number, contractAddresses: string[], verified?: boolean }
}): Promise<TokensResponse> {
    const url = `${API_URL}/v1/token`
    return await requestAPI({
        url,
        params: {
            chainId: params.chainId,
            contractAddresses: JSON.stringify(params.contractAddresses || []),
            verified: Boolean(params.verified)
        }
    });
}

async function getTokensDetailed(params: {
    chainId: number,
    contractAddresses: string[],
    returnBalance?: boolean,
    address?: string
}): Promise<{ [contractAddress: string]: TokenResponseDetailed }> {
    const url = `${API_URL}/v1/token`
    return await requestAPI({
        url,
        params: {
            chainId: params.chainId,
            contractAddresses: JSON.stringify(params.contractAddresses || []),
            returnBalance: Boolean(params.returnBalance),
            address: params.address
        }
    });
}

const CloudAPI = {
    getBalance,
    getTokens,
    getTokensDetailed,
}
export default CloudAPI
