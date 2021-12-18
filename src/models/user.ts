export default class User {

    static UNREGISTERED_ID = -1;

    /** Has the value of {@link UNREGISTERED_ID} when not registered */
    id?: number;
    username?: string;
    display?: string;
    email?: string;
    /** Possibly not hashed if received from client */
    password?: string;
    phone?: string;

    constructor(
        id: number,
        username: string, email: string, password: string,
        display: string, phone: string);

    constructor(username: string, password: string);

    constructor();

    constructor(...args: any[]) {
        if (args.length === 2) {
            this.username = args[0];
            this.password = args[1];
            return;
        }

        this.id = args[0];
        this.username = args[1];
        this.email = args[2];
        this.password = args[3];
        this.display = args[4];
        this.phone = args[5];
    }

}