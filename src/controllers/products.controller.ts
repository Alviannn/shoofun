import { Request, Response } from 'express';
import { NewProductType } from '../validations/product.validation';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '../utils/api.util';

import Product from '../entities/product.entity';

export async function addProduct(req: Request, res: Response) {
    const body = req.body as NewProductType;
    const product = Product.create(body);

    try {
        await product.save();
        return sendResponse(res, {
            message: 'Successfully added new product'
        });
    } catch (err) {
        return sendResponse(res, {
            success: false,
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            message: 'Unexpected server error'
        });
    }
}

export async function getProduct(req: Request, res: Response) {
    const { productId } = req.params;

    try {
        const foundProduct = await Product.findOne(parseInt(productId));
        if (!foundProduct || foundProduct.isDeleted) {
            return sendResponse(res, {
                success: false,
                statusCode: StatusCodes.NOT_FOUND,
                message: 'Cannot find product'
            });
        }

        return sendResponse(res, {
            message: 'Product has been found',
            data: {
                product: foundProduct.toFiltered()
            }
        });
    } catch (err) {
        return sendResponse(res, {
            success: false,
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            message: 'Unexpected server error'
        });
    }
}

export async function deleteProduct(req: Request, res: Response) {
    const { productId } = req.params;

    try {
        const foundProduct = await Product.findOne(parseInt(productId));
        if (!foundProduct) {
            return sendResponse(res, {
                success: false,
                statusCode: StatusCodes.NOT_FOUND,
                message: 'Cannot find product'
            });
        }

        foundProduct.isDeleted = true;
        await foundProduct.save();

        return sendResponse(res, {
            message: 'Product has been deleted'
        });
    } catch (err) {
        return sendResponse(res, {
            success: false,
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            message: 'Unexpected server error'
        });
    }
}

export async function getAllProducts(_: Request, res: Response) {
    try {
        const products = await Product.find({
            where: { isDeleted: false }
        });

        return sendResponse(res, {
            message: 'All products have been found',
            data: {
                products: products.map((prod) => prod.toFiltered())
            }
        });
    } catch (err) {
        return sendResponse(res, {
            success: false,
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            message: 'Unexpected server error'
        });
    }
}