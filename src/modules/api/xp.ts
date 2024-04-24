import {postAPI} from "@/modules/api/util";
import {API_URL} from "@/modules/api/constants";

async function activateAccount(params: any) {
    return await postAPI({
        url: `${API_URL}/v1/address/xp/activate`,
        body: {},
        params: params
    })
}

const XpAPI = {
    activateAccount
}
export default XpAPI
