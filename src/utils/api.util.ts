import express from 'express';

import { StatusCodes } from 'http-status-codes';

class ApiResponse {

    statusCode: number;
    success: boolean;
    message: string;
    extras: Record<string, unknown>;

    constructor(statusCode: number, success: boolean, message: string) {
        this.statusCode = statusCode;
        this.success = success;
        this.message = message;
        this.extras = {};
    }

    /**
     * Add extra properties to the response
     *
     * Chaining this method is possible
     */
    add(key: string, value: unknown) {
        this.extras[key] = value;
        return this;
    }

    /**
     * Removes a property key from extras
     *
     * Chaining this method is possible
     */
    remove(key: string) {
        delete this.extras[key];
        return this;
    }

    /**
     * Builds the response and sends it
     */
    send(res: express.Response) {
        const jsonRes = {
            status: (this.success ? 'success' : 'fail'),
            message: this.message
        };

        if (this.extras) {
            Object.assign(jsonRes, this.extras);
        }

        return res.status(this.statusCode).json(jsonRes);
    }

    build(): Record<string, unknown> {
        const jsonRes = {
            status: (this.success ? 'success' : 'fail'),
            message: this.message
        };

        if (this.extras) {
            Object.assign(jsonRes, this.extras);
        }

        return jsonRes;
    }

}

export type ApiResponseOptions = {
    statusCode?: number,
    success?: boolean,
    message: string
}

export function makeResponse(options: ApiResponseOptions) {
    return new ApiResponse(
        options.statusCode ?? StatusCodes.OK,
        options.success ?? true,
        options.message
    );
}
