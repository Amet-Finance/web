import {requestAPI} from "@/modules/cloud-api/util";
import {API_URL} from "@/modules/cloud-api/constants";
import {
    GeneralStatistics,
    GeneralStatsKey,
    StatisticsTypes,
    TBVStatistics,
    TokensResponse
} from "@/modules/cloud-api/type";
import {TokenResponseDetailed} from "@/modules/web3/type";

async function getBalance(address: string): Promise<{[contractId: string]: {[id: string]: number}}> {
    const url = `${API_URL}/v1/balance/${address}`
    const response = await requestAPI({url});
    return response?.data;
}


async function getStatistics<T extends StatisticsTypes>(type: T): Promise<T extends GeneralStatsKey ? GeneralStatistics : TBVStatistics> {
    const url = `${API_URL}/v1/statistics`;
    const response = await requestAPI({url, params: {type}});
    return response?.data as T extends GeneralStatsKey ? GeneralStatistics : TBVStatistics;
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
    getStatistics,
    getTokens,
    getTokensDetailed,
}
export default CloudAPI
