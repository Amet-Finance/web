import {requestAPI} from "@/modules/cloud-api/util";
import {API_URL} from "@/modules/cloud-api/constants";
import {DEFAULT_CHAIN_ID} from "@/modules/web3/constants";
import {BondGeneral} from "@/components/pages/bonds/pages/issue/type";
import {BalanceAPIParams, BondsAPIParams} from "@/modules/cloud-api/type";

async function getBonds(config: BondsAPIParams): Promise<BondGeneral[]> {
    const bondsAPI = `${API_URL}/v1/contract`
    const {data} = await requestAPI({
        url: bondsAPI,
        params: config
    });
    return data;
}

async function getStats() {
    const statisticsAPI = `${API_URL}/v1/statistics`
    const {data} = await requestAPI({
        url: statisticsAPI
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