
const toTemplateResponseApi=(params)=>{

    return {
        request_id: params.request_id,
        status: params.status,
        message: params.message,
        data: params.data
    }
}
module.exports = toTemplateResponseApi;