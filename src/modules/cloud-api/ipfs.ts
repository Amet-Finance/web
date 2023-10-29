import {IPFS_URL} from "@/modules/cloud-api/constants";
import {requestAPI} from "@/modules/cloud-api/util";

async function getIpfsData(hash: string) {
    const url = `${IPFS_URL}/${hash}`
    return await requestAPI({
        url,
    });
}

export {
    getIpfsData
}
