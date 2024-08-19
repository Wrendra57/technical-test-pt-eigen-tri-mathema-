const toTemplateResponseApi = require("../../utils/templateResponeApi");
const validation = (schema)=> async (req,res,next)=>{
    try {
        await schema.validate({
            body: req.body,
            query: req.query,
            params: req.params,
            noUnknown: true,
            strict: true,
        });
        return next()
    } catch (err) {
        const send ={
            request_id: req.requestId,
            status: "Error",
            message: err.message,
            data: null
        }
        console.error(`Request ID: ${send.request_id} - Validation Error`, err.message);

        return res.status(400).json(toTemplateResponseApi(send))
    }
}

module.exports={
    validation
}