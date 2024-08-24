const yup = require('yup');
const regex = /^[a-zA-Z0-9-]+$/;
const createBorrowValidation = yup.object({
   body: yup.object({
       codeUser: yup
           .string()
           .required("Code User is required")
           .min(2, "Code User must be at least 2")
           .max(10, "Code User must be maximum 10 characters")
           .matches(regex,{message:"Code User must be Number, Alphabet, & '-'"}),
       codeBook: yup.string()
           .required("Code Book is required")
           .min(2, "Code Book must be at least 2")
           .max(10, "Code Book must be maximum 10 characters")
           .matches(regex,{message:"Code Book must be Number, Alphabet, & '-'"})
   })
        .noUnknown(true)
})

const returnBorrowValidation = yup.object({
    body: yup.object({
        borrow_id: yup
            .number()
            .typeError("Borrow ID must be a number")
            .integer("Borrow ID must be a number")
            .positive("Borrow ID must be a positive number")
            .notRequired(),
        code_user: yup
            .string()
            .min(2, "Code User must be at least 2 characters")
            .max(10, "Code User must be maximum 10 characters")
            .matches(regex, { message: "Code User must be Number, Alphabet, & '-'" })
            .notRequired(),
        code_book: yup
            .string()
            .min(2, "Code Book must be at least 2 characters")
            .max(10, "Code Book must be maximum 10 characters")
            .matches(regex, { message: "Code Book must be Number, Alphabet, & '-'" })
            .notRequired()
    })
});


module.exports={
    createBorrowValidation, returnBorrowValidation
}