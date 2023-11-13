import * as CloudAPI from "@/modules/cloud-api";

type Config = {
    skip: number
    limit: number
    chainId: number,
    isTrending?: boolean
}

function getBondsHandler(bondsHandler: any, config: Config) {
    const [bonds, setBonds] = bondsHandler

    setBonds({
        ...bonds,
        isLoading: true
    })

    CloudAPI.getBonds(config)
        .then(data => setBonds({
            ...bonds,
            data,
            isLoading: false
        }))


    return setInterval(() => {
        CloudAPI.getBonds(config)
            .then(data => setBonds({
                ...bonds,
                data
            }))
    }, 10000)
}

export {
    getBondsHandler
}
