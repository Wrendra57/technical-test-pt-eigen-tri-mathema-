const yup = require('yup');

const createBookValidation = yup.object({
    body: yup.object({
        code: yup
            .string()
            .required('Code is required')
            .min(2, 'Code must be at least 2 characters')
            .max(10, "Code must be maximum 10 characters"),
        title: yup
            .string()
            .required('Title is required')
            .min(2, 'Title must be at least 2 characters')
            .max(255, "Title must be maximum 255 characters"),
        author: yup
            .string()
            .required('Author is required')
            .min(2, 'Author must be at least 2 characters')
            .max(255, "Author must be maximum 255 characters"),
        stock: yup.number().typeError('Stock must be number').required('Stock is required').positive("Stock must be at least 1").integer("Stock must be integer")
    })
        .noUnknown(true)
})

module.exports={
    createBookValidation
}