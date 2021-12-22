import bcrypt from 'bcrypt';
import User from '../models/user';
import { psql } from '../main';
import jwt from 'jsonwebtoken';

const ROUNDS = 12;

type UserOptions = {
    id?: number,
    name?: string,
    email?: string,
}

/**
 * Registers a user to the database.
 * Upon receiving the object, it should already been checked in the frontend.
 *
 * NOTE: There's no double check for web scraper.
 *
 * @param user is expected to be complete
 */
export async function registerUser(user: User): Promise<boolean> {
    const userExist = await doesUserExist({ email: user.email });
    if (userExist) {
        return false;
    }

    // the password from user isn't hashed
    const hashedPwd = await bcrypt.hash(user.password!, ROUNDS);

    await psql.query(
        `INSERT INTO users
            (name, email, password, display, phone)
        VALUES
            ($1, $2, $3, $4, $5);`,
        [user.username, user.email, hashedPwd, user.display, user.phone]
    );

    return true;
}

/**
 * Finds a user data based on a specific property.
 *
 * Although this is a bit expensive to be used for only checking existence,
 * there's an alternative called {@link doesUserExist}.
 *
 * @param options the options to find the user based on specific property.
 * @returns an array of user, will be empty if not found.
 */
export async function findUser(
    options: UserOptions): Promise<User[]> {

    if (!options.id || !options.email || !options.name) {
        return [];
    }

    // find a key that has a value
    const param = Object.entries(options)
        .find((entry) => Boolean(entry[1]));

    const { rows } = await psql.query(
        `SELECT * FROM users WHERE ${param} = $1;`,
        [param]
    );

    return rows as User[];
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
    if (!options.id || !options.email || !options.name) {
        return false;
    }

    // find a key that has a value
    const param = Object.entries(options)
        .find((entry) => Boolean(entry[1]));

    const { rows } = await psql.query(
        `SELECT id FROM users WHERE ${param} = $1;`,
        [param]
    );

    return Boolean(rows);
}

/**
 * Tests user validity by their existence and password.
 *
 * @param user the user object recevied from client (incomplete)
 * @returns `true` if the user is valid, `false` is otherwise.
 */
export async function loginUser(user: User): Promise<boolean> {
    const { rows } = await psql.query(
        'SELECT password FROM users WHERE name = $1;',
        [user.username]
    );

    // the password from user object isn't hashed, we can just check it.
    return bcrypt.compare(user.password!, rows[0].password);
}