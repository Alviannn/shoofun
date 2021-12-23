CREATE TABLE IF NOT EXISTS users (
    id SERIAL,

    username VARCHAR(16) NOT NULL,
    email VARCHAR(64) NOT NULL,
    password VARCHAR(64) NOT NULL,
    display VARCHAR(64) NOT NULL,
    phone VARCHAR(64) NOT NULL,

    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS items (
    id SERIAL,

    name VARCHAR(64) NOT NULL,
    price INT NOT NULL,
    description VARCHAR(256) NOT NULL,

    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS receipts (
    id SERIAL,

    userId INT NOT NULL,
    purchaseDate DATE NOT NULL,

    PRIMARY KEY (id),
    FOREIGN KEY (userId) REFERENCES users (id)
);

CREATE TABLE IF NOT EXISTS orders (
    id SERIAL,

    receiptId INT NOT NULL,
    itemId INT NOT NULL,
    quantity INT NOT NULL,

    PRIMARY KEY (id),
    FOREIGN KEY (receiptId) REFERENCES receipts (id),
    FOREIGN KEY (itemId) REFERENCES items (id)
);