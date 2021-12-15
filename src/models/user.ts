export default class User {

    /** Has the value of `-1` when not registered */
    id: number;
    name: string;
    display: string;
    email: string;
    /** Possibly not hashed if received from client */
    password: string;
    phone: string;

    constructor(
        id = -1,
        name: string, display = '',
        email: string, password: string,
        phone: string) {
        this.id = id;
        this.name = name;
        this.display = display;
        this.email = email;
        this.password = password;
        this.phone = phone;
    }

}