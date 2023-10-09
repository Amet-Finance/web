import * as CloudAPI from "@/modules/cloud-api";

function getBondsHandler(bondsHandler: any, config: any) {
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


    const interval = setInterval(() => {

        CloudAPI.getBonds(config)
            .then(response => setBonds({
                ...bonds,
                data: response,
                isLoading: false
            }))
    }, 3000)

    return interval
}

export  {
    getBondsHandler
}