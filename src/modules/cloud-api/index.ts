import {requestAPI} from "@/modules/cloud-api/util";
import {API_URL} from "@/modules/cloud-api/constants";
import {DEFAULT_CHAIN_ID} from "@/modules/web3/constants";
import {BondGeneral} from "@/components/pages/bonds/pages/issue/type";

async function getBonds(): Promise<BondGeneral[]> {
    const bondsAPI = `${API_URL}/v1/contract`
    const {data} = await requestAPI({
        url: bondsAPI,
        params: {
            chainId: DEFAULT_CHAIN_ID
        }
    });
    return data;
}

async function getStats() {
    const statisticsAPI = `${API_URL}/v1/statistics`
    const {data} = await requestAPI({
        url: statisticsAPI,
        params: {
            chainId: DEFAULT_CHAIN_ID
        }
    });
    return data;
}

async function getBalance(address: string) {
    const balanceAPI = `${API_URL}/v1/balance/${address}`
    const {data} = await requestAPI({
        url: balanceAPI,
        params: {
            chainId: DEFAULT_CHAIN_ID
        }
    });
    return data;
}

export {
    getBonds,
    getStats,
    getBalance
}