import joi from 'joi';

type NewProductType = {
    name: string,
    price: number,
    description: string
};

export const newProductSchema = joi.object({
    name: joi.string()
        .min(3)
        .max(64)
        .required(),

    price: joi.number().required(),

    description: joi.string()
        .min(5)
        .max(256)
        .required()
}) as joi.ObjectSchema<NewProductType>;