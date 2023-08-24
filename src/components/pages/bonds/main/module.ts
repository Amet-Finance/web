import * as CloudAPI from '../../../../modules/cloud-api/index'

async function getBonds() {
    return CloudAPI.getBonds()
}

export {
    getBonds
}