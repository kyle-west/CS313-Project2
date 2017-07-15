
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS users2;
DROP TABLE IF EXISTS accounts;

CREATE TABLE accounts (
   id              SERIAL       PRIMARY KEY   NOT NULL,
   name            VARCHAR(255), -- Use to be NOT NULL, but this was unneeded.
   active          BOOLEAN      DEFAULT TRUE  NOT NULL,
   connection_code VARCHAR(255) UNIQUE
);


CREATE TABLE users2 (
   id         SERIAL  PRIMARY KEY             NOT NULL,
   username   VARCHAR(255) UNIQUE             NOT NULL,
   password   VARCHAR(255)                    NOT NULL,
   account_id INTEGER REFERENCES accounts(id) NOT NULL
);


CREATE TABLE transactions (
   id         SERIAL  PRIMARY KEY             NOT NULL,
   account_id INTEGER REFERENCES accounts(id) NOT NULL,
   user_id    INTEGER REFERENCES users2(id)   NOT NULL,
   amount     NUMERIC                         NOT NULL,
   transdate  DATE                            NOT NULL,
   active     BOOLEAN DEFAULT TRUE            NOT NULL,
   notes      TEXT
);

-- Seed database
\i seed.sql

-- validate setup
\d+ accounts;
\d+ users2;
\d+ transactions;

SELECT * FROM accounts;
SELECT * FROM users2;
SELECT * FROM transactions;
