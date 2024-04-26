import axios, {AxiosHeaders} from "axios";
import {StringKeyedObject} from "@/components/utils/types";

async function requestAPI({url, params, headers, showError}: {
    url: string,
    params?: StringKeyedObject<any>,
    headers?: AxiosHeaders,
    showError?: boolean
}) {
    try {
        const response = await axios.get(url, {params, headers})
        return response.data;
    } catch (error) {
        if (showError) console.error(`requestAPI`, error);
        return undefined;
    }
}

async function postAPI({url, body, params, headers}: { url: string, body: any, params?: any, headers?: any }) {
    try {
        const response = await axios.post(url, body, {params, headers})
        return response.data;
    } catch (error: any) {
        console.error(`postAPI`, error.message)
        return undefined;
    }
}


async function patchAPI({url, body, params, headers}: { url: string, body: any, params?: any, headers?: any }) {
    try {
        const response = await axios.patch(url, body, {params, headers})
        return response.data;
    } catch (error) {
        console.log(`patchAPI`, error)
        return undefined;
    }
}


export {
    requestAPI,
    postAPI,
    patchAPI
}
