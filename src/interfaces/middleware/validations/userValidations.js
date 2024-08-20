const yup = require('yup');
const regex = /^[a-zA-Z\s]+$/;
const createUserValidation = yup.object({
    body: yup.object({
        name: yup
            .string()
            .required('Name is required')
            .min(3, 'Name must be at least 3 characters')
            .max(255, 'Name must be maximum 255 characters')
            .matches(regex,{message:"Name must be only alphabet"})
    })

        .noUnknown(true)
})

module.exports={
    createUserValidation
}