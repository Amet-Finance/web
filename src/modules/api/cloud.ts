import {patchAPI, requestAPI} from "@/modules/api/util";
import {API_URL} from "@/modules/api/constants";
import {GeneralStatistics, GeneralStatsKey, StatisticsTypes, TBVStatistics, TokensResponse} from "@/modules/api/type";
import {TokenResponseDetailed} from "@/modules/web3/type";
import {ContractDescription, DescriptionEditParams} from "@/modules/api/contract-type";


async function getStatistics<T extends StatisticsTypes>(type: T): Promise<T extends GeneralStatsKey ? GeneralStatistics : TBVStatistics> {
    const url = `${API_URL}/v1/statistics`;
    const response = await requestAPI({url, params: {type}});
    return response?.data as T extends GeneralStatsKey ? GeneralStatistics : TBVStatistics;
}


async function getTokens(params: { chainId?: number, contractAddresses?: string[], verified?: boolean }): Promise<TokensResponse> {
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

async function updateContractDescription(params: DescriptionEditParams): Promise<ContractDescription> {
    return await patchAPI({
        url: `${API_URL}/v2/contract/description`,
        body: params,
        params: {
            address: params.address,
            signature: params.signature,
            message: params.message
        }
    });
}


const CloudAPI = {
    getStatistics,
    getTokens,
    getTokensDetailed,
    updateContractDescription
}
export default CloudAPI
