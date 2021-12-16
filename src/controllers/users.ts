import bcrypt from 'bcrypt';
import User from '../models/user';
import { psql } from '../main';

const ROUNDS = 12;

type UserOptions = {
    id?: number,
    name?: string,
    email?: string,
}

/**
 * Registers a user to the database
 *
 * @param user the user object recevied from client (incomplete)
 */
export async function register(user: User): Promise<boolean> {
    // TODO: validate object

    const userExist = await doesUserExist({ email: user.email });
    if (!userExist) {
        return false;
    }

    // the password from user isn't hashed
    const hashedPwd = await bcrypt.hash(user.password!, ROUNDS);

    await psql.query(
        `INSERT INTO users
            (name, display, email, password, phone)
        VALUES
            ($1, $2, $3, $4, $5);`,
        [user.name, user.display, hashedPwd, user.phone]
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
export async function testLogin(user: User): Promise<boolean> {
    if (!user.id) {
        return false;
    }

    const { rows } = await psql.query(
        'SELECT password FROM users WHERE email = $1;',
        [user.email]
    );

    // the password from user object isn't hashed, we can just check it.
    return bcrypt.compare(user.password!, rows[0]);
}