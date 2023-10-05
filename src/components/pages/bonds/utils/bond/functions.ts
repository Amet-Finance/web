import * as CloudAPI from "@/modules/cloud-api";

function getBondsHandler(bondsHandler: any) {
    const [bonds, setBonds] = bondsHandler

    setBonds({
        ...bonds,
        isLoading: true
    })

    CloudAPI.getBonds()
        .then(response => setBonds({
            ...bonds,
            data: response,
            isLoading: false
        }))


    const interval = setInterval(() => {

        CloudAPI.getBonds()
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