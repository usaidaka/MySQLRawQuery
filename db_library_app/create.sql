-- SET UP CONNECTION TROUBLE SHOOTING
CREATE SCHEMA IF NOT EXISTS library_app
  DEFAULT CHARACTER SET utf8
  DEFAULT COLLATE utf8_general_ci;

CREATE TABLE book (
    idBook int NOT NULL AUTO_INCREMENT,
    name varchar(45),
    author varchar(45),
	idCategory int NOT NULL,
    created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (idBook),
    FOREIGN KEY (idCategory) REFERENCES Category(idCategory)
);
ALTER TABLE book   
    ADD COLUMN deleted_at timestamp AFTER updated_at;

CREATE TABLE category (
    idCategory int NOT NULL AUTO_INCREMENT,
    name varchar(45) NOT NULL,
    created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (idCategory)
);
ALTER TABLE category   
    ADD COLUMN deleted_at timestamp AFTER updated_at;

CREATE TABLE customer (
    idCustomer int NOT NULL AUTO_INCREMENT,
    name varchar(45) NOT NULL,
    phone varchar(45) NOT NULL UNIQUE,
	address text NOT NULL,
    created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (idCustomer)
);
ALTER TABLE customer   
    ADD COLUMN deleted_at timestamp AFTER updated_at;

CREATE TABLE bookLending (
    idBookLending int NOT NULL AUTO_INCREMENT,
    idCustomer int NOT NULL,
    idBook int NOT NULL,
    created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (idBookLending),
    FOREIGN KEY (idCustomer) REFERENCES Customer(idCustomer),
	FOREIGN KEY (idBook) REFERENCES Book(idBook)
);
ALTER TABLE bookLending   
    ADD COLUMN deleted_at timestamp AFTER updated_at;	
