import User from '../models/user';
import { psql } from '../main';

type UserOptions = {
    id?: number,
    username?: string,
    email?: string,
}

/**
 * A key of string and value of either string or value,
 * it follows the format of {@link UserOptions}
 */
type UserParams = [string, string | number];

export const HASH_ROUNDS = 12;

function grabUsedParams(options: UserOptions): UserParams | undefined {
    if (!options) {
        return;
    }

    // find a key that has a value
    return Object.entries(options)
        .find((entry) => Boolean(entry[1]));
}

/**
 * Finds a user data based on a specific property.
 *
 * Although this is a bit expensive to be used for only checking existence,
 * there's an alternative called {@link doesUserExist}.
 *
 * @param options the options to find the user based on specific property.
 * @returns a user object if exists, otherwise none at all
 */
export async function findUser(
    options: UserOptions): Promise<User | undefined> {

    const param = grabUsedParams(options);
    if (!param) {
        return;
    }

    try {
        const { rows } = await psql.query(
            `SELECT * FROM users WHERE ${param[0]} = $1;`,
            [param[1]]
        );

        return rows[0] as User;
    } catch (err) {
        return;
    }
}

/**
 * This is the cheaper version of the function to check the user existence.
 *
 * Checking user existence using the {@link findUser} can be expensive
 * and bad practice since it grabs the entire user property.
 *
 * @param options the options to find the user based on specific property.
 */
export async function doesUserExist(options: UserOptions): Promise<boolean> {
    const param = grabUsedParams(options);
    if (!param) {
        return false;
    }

    try {
        const { rows } = await psql.query(
            `SELECT id FROM users WHERE ${param[0]} = $1;`,
            [param[1]]
        );

        return Boolean(rows.length);
    } catch (err) {
        return false;
    }
}