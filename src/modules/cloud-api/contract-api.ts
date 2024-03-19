import {API_URL, ResponseFormat} from "@/modules/cloud-api/constants";
import {patchAPI, requestAPI} from "@/modules/cloud-api/util";
import {
    ContractDescription,
    ContractCoreDetails,
    ContractExtendedFormat,
    ContractQuery,
    DescriptionEditParams
} from "@/modules/cloud-api/contract-type";

async function getContractsBasic(params: ContractQuery): Promise<ContractCoreDetails[]> {
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


const ContractAPI = {
    getContractsBasic,
    getContractsExtended,
    updateContractDescription
}

export default ContractAPI;
