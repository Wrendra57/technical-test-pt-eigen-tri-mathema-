
const toTemplateResponseApi=(params)=>{

    return {
        request_id: params.request_id,
        status: params.status,
        message: params.message,
        data: params.data
    }
}


const internalServerError = (requestId)=>{
    return {
        request_id: requestId,
        code:500,
        status: "Error",
        message: "Internal Server Error",
        data: null
    }
}
const badRequest = (requestId, message)=>{
    return {
        request_id: requestId,
        code:400,
        status: "Error",
        message: message,
        data: null
    }
}
const notFound = (requestId, message)=>{
    return {
        request_id: requestId,
        code:404,
        status: "Error",
        message: message,
        data: null
    }
}
const success = (requestId, data, message)=>{
    return {
        request_id: requestId,
        code:200,
        status: "Success",
        message: message,
        data: data
    }
}
const created = (requestId, data, message)=>{
    return {
        request_id: requestId,
        code:201,
        status: "Success",
        message: message,
        data: data
    }
}

module.exports = {toTemplateResponseApi,internalServerError,badRequest, notFound,success,created};