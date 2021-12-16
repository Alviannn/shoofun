export default class User {

    /** Has the value of `-1` when not registered */
    id?: number;
    name?: string;
    display?: string;
    email?: string;
    /** Possibly not hashed if received from client */
    password?: string;
    phone?: string;

    constructor(
        id: number | null,
        name: string, email: string, password: string,
        display: string | null, phone: string);

    constructor();

    constructor(...args: any[]) {
        if (args.length !== 6) {
            return;
        }

        Object.assign(this, args);
    }

}