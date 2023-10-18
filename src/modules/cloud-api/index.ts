import {requestAPI} from "@/modules/cloud-api/util";
import {API_URL} from "@/modules/cloud-api/constants";
import {BondGeneral} from "@/components/pages/bonds/pages/issue/type";
import {BalanceAPIParams, BondsAPIParams, StatsAPIParams} from "@/modules/cloud-api/type";

async function getBonds(params: BondsAPIParams): Promise<BondGeneral[]> {
    const bondsAPI = `${API_URL}/v1/contract`
    const {data} = await requestAPI({
        url: bondsAPI,
        params
    });
    return data;
}

async function getStats(params: StatsAPIParams) {
    const statisticsAPI = `${API_URL}/v1/statistics`
    const {data} = await requestAPI({
        url: statisticsAPI,
        params
    });
    return data;
}

async function getBalance({address, chainId}: BalanceAPIParams) {
    const balanceAPI = `${API_URL}/v1/balance/${address}`
    const {data} = await requestAPI({
        url: balanceAPI,
        params: {chainId}
    });
    return data;
}

export {
    getBonds,
    getStats,
    getBalance
}