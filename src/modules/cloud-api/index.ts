import {postAPI, requestAPI} from "@/modules/cloud-api/util";
import {API_URL} from "@/modules/cloud-api/constants";
import {BondGeneral} from "@/components/pages/bonds/pages/issue/type";
import {
    BalanceAPIParams,
    BondDetailedAPIParams,
    BondsAPIParams,
    DetailedBondResponse,
    StatsAPIParams,
    TokensResponse
} from "@/modules/cloud-api/type";
import {TokenResponseDetailed} from "@/modules/web3/type";

async function getBonds(params: BondsAPIParams): Promise<BondGeneral[]> {
    const bondsAPI = `${API_URL}/v1/contract`
    const response = await requestAPI({
        url: bondsAPI,
        params
    });
    return response?.data;
}

async function getBondDetailed(params: BondDetailedAPIParams): Promise<DetailedBondResponse> {
    const bondsAPI = `${API_URL}/v1/contract/detailed/${params._id}`
    return await requestAPI({
        url: bondsAPI,
        params: {
            chainId: params.chainId
        }
    });
}

async function getStats(params: StatsAPIParams) {
    const statisticsAPI = `${API_URL}/v1/statistics`
    const response = await requestAPI({
        url: statisticsAPI,
        params
    });
    return response?.data;
}

async function getBalance({address, chainId}: BalanceAPIParams) {
    const balanceAPI = `${API_URL}/v1/balance/${address}`
    const response = await requestAPI({
        url: balanceAPI,
        params: {chainId}
    });
    return response?.data;
}

// todo add types for this
async function getAddress({address}: any) {
    const addressAPI = `${API_URL}/v1/address`
    return await requestAPI({
        url: addressAPI,
        params: {address}
    });
}

async function updateAddress({params, body}: any) {
    const addressAPI = `${API_URL}/v1/address`
    return await postAPI({
        url: addressAPI,
        body,
        params
    });
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
    getBonds,
    getBondDetailed,
    getStats,
    getBalance,
    getAddress,
    updateAddress,
    getTokens,
    getTokensDetailed,
}
export default CloudAPI
