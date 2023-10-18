import * as CloudAPI from "@/modules/cloud-api";

type Config = {
    skip: number
    limit: number
    chainId: string
}

function getBondsHandler(bondsHandler: any, config: Config) {
    const [bonds, setBonds] = bondsHandler

    setBonds({
        ...bonds,
        isLoading: true
    })

    CloudAPI.getBonds(config)
        .then(response => setBonds({
            ...bonds,
            data: response,
            isLoading: false
        }))


    return setInterval(() => {
        CloudAPI.getBonds(config)
            .then(response => setBonds({
                ...bonds,
                data: response,
                isLoading: false
            }))
    }, 3000)
}

export {
    getBondsHandler
}