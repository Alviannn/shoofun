import { Request, Response } from 'express';
import { newProductSchema } from '../validations/product.validation';
import { makeResponse } from '../utils/api.util';
import { StatusCodes } from 'http-status-codes';

import Product from '../entities/product.entity';

export async function addProduct(req: Request, res: Response) {
    const { body } = req;
    const result = newProductSchema.validate(body);

    if (result.error) {
        return makeResponse({
            statusCode: StatusCodes.BAD_REQUEST,
            success: false,
            message: result.error.message
        }).send(res);
    }

    const { value } = result;
    const product = Product.create(value);

    try {
        await product.save();
        return makeResponse({
            message: 'Successfully added new product'
        }).send(res);
    } catch (err) {
        return makeResponse({
            success: false,
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            message: 'Unexpected server error'
        }).send(res);
    }
}

export async function getProduct(req: Request, res: Response) {
    const { productId } = req.params;

    try {
        const foundProduct = await Product.findOne(productId);
        if (!foundProduct) {
            return makeResponse({
                success: false,
                statusCode: StatusCodes.NOT_FOUND,
                message: 'Cannot find product'
            }).send(res);
        }

        return makeResponse({
            message: 'Product has been found'
        })
            .add('product', foundProduct)
            .send(res);
    } catch (err) {
        return makeResponse({
            success: false,
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            message: 'Unexpected server error'
        }).send(res);
    }
}

export async function deleteProduct(req: Request, res: Response) {
    const { productId } = req.params;

    try {
        const foundProduct = await Product.findOne(productId);
        if (!foundProduct) {
            return makeResponse({
                success: false,
                statusCode: StatusCodes.NOT_FOUND,
                message: 'Cannot find product'
            }).send(res);
        }

        foundProduct.isDeleted = true;
        await foundProduct.save();

        return makeResponse({
            message: 'Product has been deleted'
        }).send(res);
    } catch (err) {
        return makeResponse({
            success: false,
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            message: 'Unexpected server error'
        }).send(res);
    }
}

export async function getAllProducts(_: Request, res: Response) {
    try {
        const products = await Product.find();

        return makeResponse({
            message: 'All products have been found'
        })
            .add('products', products)
            .send(res);
    } catch (err) {
        return makeResponse({
            success: false,
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            message: 'Unexpected server error'
        }).send(res);
    }
}