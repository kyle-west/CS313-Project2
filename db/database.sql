
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
   notes      TEXT
);

INSERT INTO accounts (name, connection_code) VALUES ('PERM Acount', '1234abcd');
INSERT INTO users2 (username, password, account_id) VALUES
   ('PERM', 'password', 1),
   ('PERM2', 'password', 1);

INSERT INTO transactions (account_id, user_id, amount, notes, transdate) VALUES
   (1, 1, 543.21, 'This is the first intitial ballance', DATE '2015-11-28'),
   (1, 1, -32.45, 'Walmart', DATE '2017-06-23'),
   (1, 2, -11.23, 'Lunch at school', DATE '2017-06-25'),
   (1, 2,   0.00, 'THIS ONE NEEDS TO BE EDITED', DATE '2017-05-18'),
   (1, 2,   0.00, 'THIS ONE NEEDS TO BE DELETED', DATE '2017-06-24'),
   (1,
      (SELECT id FROM users2 WHERE username = 'PERM')
      , 150.00, 'Pay Check', DATE '2017-02-28'),
   (1, 1, -15.00, 'Tithing', DATE '2016-12-31'),
   (1, 2,  -8.32, 'Taco Bell', DATE '2017-06-15');

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
