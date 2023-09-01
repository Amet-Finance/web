import axios from "axios";

async function requestAPI({url, params, headers}: any) {
    try {
        const response = await axios.get(url, {params, headers})
        return response.data;
    } catch (error) {
        console.log(error)
        return {data: undefined}
    }
}

export {
    requestAPI
}