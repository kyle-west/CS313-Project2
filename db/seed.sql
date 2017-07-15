INSERT INTO accounts (name, connection_code) VALUES
   ('PERM Acount', '1234abcd'),        -- these connection_codes will fail the vaildator
   ('PERM3 Acount', 'qwerkgfccvbnbv'); --    when another user tries to connect

INSERT INTO users2 (username, password, account_id) VALUES
   ('PERM',  '$2a$10$p7lqeEdhFL/KZVeIeuN6vO6j9ZFeQH05svwliGeLUR7rw5u8VQMya', 1),
   ('PERM2', '$2a$10$p7lqeEdhFL/KZVeIeuN6vO6j9ZFeQH05svwliGeLUR7rw5u8VQMya', 1),
   ('PERM3', '$2a$10$p7lqeEdhFL/KZVeIeuN6vO6j9ZFeQH05svwliGeLUR7rw5u8VQMya', 2);

INSERT INTO transactions (account_id, user_id, amount, notes, transdate) VALUES
   (1, 1, 543.21, 'This is the first intitial ballance', DATE '2015-11-28'),
   (1, 1, -32.45, 'Walmart', DATE '2017-06-23'),
   (1, 2, -11.23, 'Lunch at school', DATE '2017-06-25'),
   (1, 2,   0.00, 'THIS ONE NEEDS TO BE EDITED', DATE '2017-05-18'),
   (1, 2,   0.00, 'THIS ONE NEEDS TO BE DELETED', DATE '2017-06-24'),
   (1, (SELECT id FROM users2 WHERE username = 'PERM')
       , 150.00, 'Pay Check', DATE '2017-02-28'),
   (1, 1, -15.00, null, DATE '2016-12-31'),
   (1, 2,  -8.32, 'Taco Bell', DATE '2017-06-15');

INSERT INTO transactions (account_id, user_id, amount, notes, transdate, active) VALUES
   (1, (SELECT id FROM users2 WHERE username = 'PERM'), 150.00, 'Pay Check 2', DATE '2017-06-24', FALSE)
   RETURNING id;
