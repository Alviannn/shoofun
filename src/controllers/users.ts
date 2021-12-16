import bcrypt from 'bcrypt';
import User from '../models/user';
import { psql } from '../main';

const ROUNDS = 12;

/**
 * @param user The incomplete user object
 */
export async function register(user: User) {
    // since the password isn't yet hashed, we're hashing it
    user.password = await bcrypt.hash(user.password, ROUNDS);

    await psql.query(
        `INSERT INTO users
            (name, display, email, password, phone)
        VALUES
            ($1, $2, $3, $4, $5);`,
        [user.name, user.display, user.password, user.phone]
    );
}

export async function findUser(idOrName: number | string) {
    // TODO:
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
    return bcrypt.compare(user.password, rows[0]);
}