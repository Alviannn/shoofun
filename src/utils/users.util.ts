import User from '../entities/user.entity';

type UserOptions = {
    id?: number,
    username?: string,
    email?: string,
}

/**
 * The result from grabbing one entry that's not empty.
 *
 * If the {@link UserOptions} has both `id` and `email` not empty
 * it'll get the `id` since that's the specified order.
 */
type UserParams = {
    key: string,
    value: string | number
};

function grabUsedParams(options: UserOptions): UserParams | undefined {
    if (!options) {
        return;
    }

    // find a key that has a value
    const res = Object.entries(options)
        .find((entry) => Boolean(entry[1]));

    if (res) {
        return { key: res[0], value: res[1] };
    }
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
        return User.findOne({ where: { [param.key]: param.value } });
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
        const { key, value } = param;
        const found = await User.createQueryBuilder('user')
            .select(['id'])
            .where(`user.${key} = :val`, { val: value })
            .getRawOne();

        return Boolean(found);
    } catch (err) {
        return false;
    }
}

export async function addAdminIfNotExists() {
    const admin = User.create({
        username: 'adoMin0s',
        email: 'admin@admin.com',
        password: '5S&jJazT6LViB@f8y8ac',
        displayName: 'Admin',
        phoneNumber: '0'
    });

    const userExists = await doesUserExist({
        username: admin.username
    });

    if (!userExists) {
        await admin.save();
    }
}

export { UserParams };