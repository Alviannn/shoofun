import joi from 'joi';

export type NewProductType = {
    name: string,
    price: number,
    description: string,
    weight: number
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
        .required(),

    weight: joi.number()
        .required()
});

export const idProductSchema = joi.object({
    productId: joi.number()
        .min(1)
        .required()
});