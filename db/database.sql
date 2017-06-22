
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS users2;
DROP TABLE IF EXISTS accounts;

CREATE TABLE accounts (
   id              SERIAL       PRIMARY KEY   NOT NULL,
   name            VARCHAR(255)               NOT NULL,
   active          BOOLEAN      DEFAULT TRUE  NOT NULL,
   connection_code VARCHAR(255) UNIQUE
);


CREATE TABLE users2 (
   id         SERIAL  PRIMARY KEY             NOT NULL,
   username   VARCHAR(50)  UNIQUE             NOT NULL,
   password   VARCHAR(255)                    NOT NULL,
   account_id INTEGER REFERENCES accounts(id) NOT NULL
);


CREATE TABLE transactions (
   id         SERIAL  PRIMARY KEY             NOT NULL,
   account_id INTEGER REFERENCES accounts(id) NOT NULL,
   user_id    INTEGER REFERENCES users2(id)   NOT NULL,
   amount     NUMERIC                         NOT NULL,
   notes      TEXT
);

INSERT INTO accounts (name, connection_code) VALUES ('PERM Acount', '1234abcd');
INSERT INTO users2 (username, password, account_id) VALUES
   ('PERM', 'password', 1),
   ('PERM2', 'password', 1);

INSERT INTO transactions (account_id, user_id, amount, notes) VALUES
   (1, 1, 543.21, 'This is the first intitial ballance'),
   (1, 1, -32.45, 'Walmart'),
   (1, 2, -11.23, 'Lunch at school'),
   (1, 2,   0.00, 'THIS ONE NEEDS TO BE EDITED'),
   (1, 2,   0.00, 'THIS ONE NEEDS TO BE DELETED'),
   (1,
      (SELECT id FROM users2 WHERE username = 'PERM')
      , 150.00, 'Pay Check'),
   (1, 1, -15.00, 'Tithing'),
   (1, 2,  -8.32, 'Taco Bell');

INSERT INTO transactions (account_id, user_id, amount, notes) VALUES
   (1, (SELECT id FROM users2 WHERE username = 'PERM'), 150.00, 'Pay Check 2')
   RETURNING id;


-- validate setup
\d+ accounts;
\d+ users2;
\d+ transactions;

SELECT * FROM accounts;
SELECT * FROM users2;
SELECT * FROM transactions;
