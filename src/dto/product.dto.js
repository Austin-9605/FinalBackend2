import Joi from "joi";

export const productDto = Joi.object({
    title: Joi.string().min(3).max(30).required(),
    description: Joi.string().min(3).max(100).required(),
    code: Joi.string().required(),
    price: Joi.number().min(1).max(999999).required(),
    category: Joi.string().min(3).max(30).required()
})

productDto.validate({

})