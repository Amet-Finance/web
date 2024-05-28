import {patchAPI, postAPI, requestAPI} from "@/modules/api/util";
import {API_URL} from "@/modules/api/constants";
import {
    AuthenticatedRequest,
    GeneralStatistics,
    GeneralStatsKey,
    StatisticsTypes, SuccessResult,
    TBVStatistics,
    TokensResponse,
    User
} from "@/modules/api/type";
import {TokenResponseDetailed} from "@/modules/web3/type";
import {ContractDescription, DescriptionEditParams, EmailEditParams, ReportBody} from "@/modules/api/contract-type";


async function getUser(address: string): Promise<User> {
    const url = `${API_URL}/v1/address`;
    return await requestAPI({url, params: {address}})
}

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

async function updateContractDescription(body: DescriptionEditParams, params: AuthenticatedRequest): Promise<ContractDescription> {
    return await patchAPI({
        url: `${API_URL}/v1/bond/description`,
        body: body,
        params: params
    });
}

async function updateEmail(body: EmailEditParams, params: AuthenticatedRequest): Promise<SuccessResult> {
    return await patchAPI({
        url: `${API_URL}/v1/address`,
        body: body,
        params: params
    });
}


async function reportContract(body: ReportBody, params: AuthenticatedRequest): Promise<SuccessResult> {
    return await postAPI({
        url: `${API_URL}/v1/bond/report`,
        body: body,
        params: params
    })
}

const CloudAPI = {
    getUser,
    getStatistics,
    getTokens,
    getTokensDetailed,
    updateContractDescription,
    updateEmail,
    reportContract
}
export default CloudAPI
