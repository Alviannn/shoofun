import joi from 'joi';

type LoginUserType = {
    username: string,
    password: string
};

type RegisterUserType = LoginUserType & {
    email: string,
    displayName: string,
    phoneNumber: string
};

export const registerUserSchema = joi.object({
    username: joi.string()
        .min(3)
        .max(16)
        .required(),

    email: joi.string()
        .max(64)
        .email()
        .required(),

    password: joi.string()
        .min(8)
        .max(64)

        .regex(/[0-9]/)
        .rule({ message: '{#label} requires at least a number' })

        .regex(/[a-z]/)
        .rule({ message: '{#label} requires at least a lowercase character' })

        .regex(/[A-Z]/)
        .rule({ message: '{#label} requires at least an uppercase character' })

        .regex(/[^a-zA-Z0-9]/)
        .rule({ message: '{#label} requires at least a special character' })

        .required(),

    displayName: joi.string()
        .max(64)
        .regex(/[a-zA-Z ]+/).rule({ message: '{#label} must only be string' })
        .required(),

    phoneNumber: joi.string()
        .min(8)
        .max(64)
        .regex(/[0-9]+/)
        .rule({ message: '{#label} must be numbers' })
        .required()
}) as joi.ObjectSchema<RegisterUserType>;

export const loginUserSchema = joi.object({
    username: joi.string()
        .min(3)
        .max(16)
        .required(),

    password: joi.string()
        .min(8)
        .max(64)
        .required()
}) as joi.ObjectSchema<LoginUserType>;