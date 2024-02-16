import {API_URL, ResponseFormat} from "@/modules/cloud-api/constants";
import {requestAPI} from "@/modules/cloud-api/util";
import {ContractBasicFormat, ContractExtendedFormat, ContractQuery} from "@/modules/cloud-api/contract-type";

async function getContractsBasic(params: ContractQuery): Promise<ContractBasicFormat[]> {
    const bondsAPI = `${API_URL}/v2/contract`

    const queryParams: any = {
        responseFormat: ResponseFormat.Basic,
        ...params,
    }

    if (params.contractAddresses?.length) {
        queryParams.contractAddresses = JSON.stringify(params.contractAddresses)
    }

    const response = await requestAPI({
        url: bondsAPI,
        params: queryParams
    });
    return response?.data;
}

async function getContractsExtended(params: ContractQuery): Promise<ContractExtendedFormat[]> {
    const bondsAPI = `${API_URL}/v2/contract`
    const queryParams: any = {
        responseFormat: ResponseFormat.Extended,
        ...params,
    }

    if (params.contractAddresses?.length) {
        queryParams.contractAddresses = JSON.stringify(params.contractAddresses)
    }

    const response = await requestAPI({
        url: bondsAPI,
        params: queryParams
    });
    return response?.data;
}

const ContractAPI = {
    getContractsBasic,
    getContractsExtended
}

export default ContractAPI;
