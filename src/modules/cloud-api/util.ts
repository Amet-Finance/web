import axios from "axios";

async function requestAPI({url, params, headers}: any) {
    try {
        const response = await axios.get(url, {params, headers})
        return response.data;
    } catch (error) {
        console.log(`error`, error)
        return undefined;
    }
}

async function postAPI({url, body, params, headers}: { url: string, body: any, params?: any, headers?: any }) {
    try {
        const response = await axios.post(url, body, {params, headers})
        return response.data;
    } catch (error) {
        console.log(error)
        return undefined;
    }
}


async function patchAPI({url, body, params, headers}: { url: string, body: any, params?: any, headers?: any }) {
    try {
        const response = await axios.patch(url, body, {params, headers})
        return response.data;
    } catch (error) {
        console.log(error)
        return undefined;
    }
}


export {
    requestAPI,
    postAPI,
    patchAPI
}
