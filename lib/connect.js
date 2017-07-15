/*************************************************************
* Setup our password hashing
*************************************************************/
var bcrypt = require('bcryptjs');


/*************************************************************
* Connect to the database. I understand there is an easier way
* to do this with the 'connectionString' configuration, but
* I didn't find that out until after I wrote this parser. It
* works, and either I parse it or Pool does. Might as well
* keep it.
*************************************************************/
function parse_DATBASE_URL(url) {
   url = url.replace("postgres://", "");
   var parsed = {};
   var store = "";
   for (var i = 0; i < url.length; i++) {
      if (!parsed.user && url[i] == ':') {
         parsed.user = store; store = "";
      } else if (!parsed.password && url[i] == '@') {
         parsed.password = store; store = "";
      } else if (!parsed.host && url[i] == ':') {
         parsed.host = store; store = "";
      } else if (!parsed.port && url[i] == '/') {
         parsed.port = store; store = "";
      } else {
         store += url[i];
      }
   }
   parsed.database = store;
   return parsed;
}
const { Pool } = require('pg');
const pool = new Pool(parse_DATBASE_URL(process.env.DATABASE_URL));


/*************************************************************
* Determine whether a username and password match. Returns a
* JSON object with a success flag and other data.
*************************************************************/
function validate_user(data, callback) {
   console.log(
      "\n\n########## VALIDATE USER  ##########\nDATA ::> " +
      "user:" + data.username + " | " +
      "pass:" + data.password
   );

   // Set up merge on the account and user table to return needed
   // info for the session storage.
   var q = "SELECT u.id, u.password, u.account_id, a.connection_code "
         + "FROM users2 u INNER JOIN accounts a ON u.account_id = a.id "
         + "WHERE u.username = $1;";

   pool.query(q, [data.username], (err, res) => {
      if (err)
         console.log("ERROR: " + JSON.stringify(err));
      else {
         console.log("RESULTS: " + JSON.stringify(res));

         // test for single match
         var found = ( res.rows.length == 1);
         if (found) // avoid null row references
            var passMatch = bcrypt.compareSync(
               data.password, res.rows[0].password
            );
         var valid = found && passMatch;

         // prep additional data to send.
         var account = null;
         var ccode = null;
         if (found) account = res.rows[0].account_id;
         if (found) ccode = res.rows[0].connection_code;

         callback(err, {
            user: data.username,
            account_id: account,
            connection_code: ccode,
            valid : valid
         });
      }
   });
}


/*************************************************************
* Enter a new User Transaction into the Database
*************************************************************/
function post_new_transaction(data, callback) {
   console.log(
      "\n\nPOST NEW TRANSACTION ::> " +
      "A_ID:" + data.account_id + " | " +
      "user:" + data.username   + " | " +
      "amnt:" + data.amount     + " | " +
      "date:" + data.date       + " | " +
      "note:" + data.notes
   );

   // construct our insert query for binding
   var q = "INSERT INTO transactions "
         + "(account_id, user_id, amount, notes, transdate) VALUES "
         + "($1, (SELECT id FROM users2 WHERE username = $2), $3, $4, $5) "
         + "RETURNING id;";

   // prepare binding parameters
   var params = [
      data.account_id, // $1
      data.username,   // $2
      data.amount,     // $3
      data.notes,      // $4
      data.date        // $5
   ];

   // bind and send query
   pool.query(q, params, (err, res) => {
      if (err)
         console.log("ERROR: " + JSON.stringify(err));
      else {
         console.log("RESULTS: " + JSON.stringify(res));
         callback(err, {
            success: (res.rows.length == 1)
         });
      }
   });
}


/*************************************************************
* Simply return all the transactions in the database as JSON
*************************************************************/
function retrieve_all_transactions(data, callback) {
   console.log(
      "RETRIEVE ALL TRANSACTIONS ::> " +
      "A_ID:" + data.account_id
   );

   // prepare query for binding
   var q = "SELECT * FROM transactions WHERE account_id = $1 "
         + "ORDER BY transdate DESC, id DESC;";

   pool.query(q, [data.account_id], (err, res) => {
      if (err)
         console.log("ERROR: " + JSON.stringify(err));
      else {
         console.log("RESULTS: " + JSON.stringify(res));
         callback(err, {
            count: res.rowCount,
            rows: res.rows
         });
      }
   });
}


/*************************************************************
* When changes are made to a transaction's row, this function
* updates the whole row.
*************************************************************/
function update_user_transaction(data, callback) {
   console.log(
      "POST NEW TRANSACTION ::> " +
      "T_ID:" + data.transaction_id + " | " +
      "user:" + data.username       + " | " +
      "A_ID:" + data.account_id     + " | " +
      "amnt:" + data.amount         + " | " +
      "date:" + data.date           + " | " +
      "acti:" + data.active         + " | " +
      "note:" + data.notes
   );

   // prepare update statement for binding
   var q = "UPDATE transactions SET user_id = "
         + "(SELECT id FROM users2 WHERE username = $1), "
         + "amount = $2, notes = $3, transdate = $6, active = $7 "
         + "WHERE id = $4 AND account_id = $5 RETURNING id;";

   // binding parameters
   var params =  [
      data.username,       // $1
      data.amount,         // $2
      data.notes,          // $3
      data.transaction_id, // $4
      data.account_id,     // $5
      data.date,           // $6
      data.active          // $7
   ];

   pool.query(q, params, (err, res) => {
         if (err)
            console.log("ERROR: " + JSON.stringify(err));
         else {
            console.log("RESULTS: " + JSON.stringify(res));
            callback(err, {
               success: (res.rows.length == 1)
            });
         }
   });
}


/*************************************************************
* USE ONLY IF NEEDED. Deletes a row from the transactions.
*************************************************************/
function delete_user_transaction(data, callback) {
   console.log(
      "POST NEW TRANSACTION ::> " +
      "T_ID:" + data.transaction_id + " | " +
      "A_ID:" + data.account_id
   );

   // construct our query statement for binding
   var q = "DELETE FROM transactions WHERE id = $1 "
         + "AND account_id = $2 RETURNING id;";

   // bind values and make query
   pool.query(q, [data.transaction_id,data.account_id], (err, res) => {
      if (err)
         console.log("ERROR: " + JSON.stringify(err));
      else {
         console.log("RESULTS: " + JSON.stringify(res));
         callback(err, {
            success: (res.rows.length == 1)
         });
      }
   });
}

/*************************************************************
* Generate a random conneciton code for the DB. This is a very
* high entropy string. It has not only a long series of random
* alphanumerics, but it is variable length as well. No shorter
* than 150 chars, and no larger than 255.
*************************************************************/
function newRandStr(salt) {
   if (!salt) salt = "";
   var len = 150 + Math.floor(Math.random() * 154);
   var str = "";
   var set = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
   for( var i = 0; i < len; i++ )
      str += set.charAt(Math.floor(Math.random() * set.length));
   return str + salt;
}


/*************************************************************
* UNCONDITIONALLY create new user
*************************************************************/
function add_user(data, callback) {
   console.log("----- CREATING USER -----");

   // prepare our query string for binding
   var q = "INSERT INTO users2 (username, password, account_id) VALUES ($1,$2,$3) RETURNING id, account_id;";

   // our binding values.
   var params = [data.username, bcrypt.hashSync(data.password), data.account];

   pool.query(q, params, (err, res) => {
      if (err)
         console.log("ERROR: " + JSON.stringify(err));
      else {
         console.log("RESULTS: " + JSON.stringify(res));
         callback(err, {
            user: res.rows[0].id,
            account: res.rows[0].account_id,
            ccode: data.connection_code
         });
      }
   });
}


/*************************************************************
* CONDITIONALLY Create a new user by request of the client
*************************************************************/
function create_new_user(data, callback) {
   console.log(
      "\n\n########## CREATE NEW USER ##########\nDATA ::> " +
      "user:" + data.username + " | " +
      "pass:" + data.password + " | " +
      "code:" + data.connection_code.substr(0,15) + "..." +
      "\n------------------------------------------------------------------"
   );

   // check if the user gave us a possibly valid connection code.
   // if not, make a new one for a new account.
   if (data.connection_code.length < 149) {
      data.connection_code = newRandStr();
      console.log("Created new connection code: " + data.connection_code);
   }

   // the below query is a cheat to make SQL do what we want. What we want to
   // do is to get the id of the row that matches. If that row does not exists,
   // create it and get the id too. functionally, this query does this for us,
   // even though the string itself is odd that we would update something to its
   // current state. But it works - very well in fact.
   var q = "INSERT INTO accounts (name, connection_code) VALUES ($1, $2) "
         + "ON CONFLICT (connection_code) DO UPDATE SET connection_code = $2 "
         + "RETURNING id;";

   // our binding values for the query string
   var params = [data.username + " Account", data.connection_code];

   // Either tie to an existing account or make a new one, then tie the
   // new user to that account.
   pool.query(q, params, (errA, resA) => {
      if (errA) {
         console.log("ERROR: " + JSON.stringify(errA));
      } else {
         console.log("RESULTS: " + JSON.stringify(resA));
         data.account = resA.rows[0].id;
         add_user(data, callback);
      }
   });
}


/*************************************************************
* Tests to see if a user exists. fairly trivial.
*************************************************************/
function test_for_user(data, callback) {
   console.log("----- CHECKING USER : "+data.username);

   var q = "SELECT id FROM users2 WHERE username = $1";

   pool.query(q, [data.username], (err, res) => {
      if (err)
      console.log("ERROR: " + JSON.stringify(err));
      else {
         var results = {
            user: data.username,
            exits: (res.rows.length == 1)
         }
         console.log(results);
         callback(err, results);
      }
   });
}


/*************************************************************
* Our "international" Exports to NodeJS
*************************************************************/
module.exports = {
   user : {
      create: create_new_user,
      validate: validate_user,
      exists: test_for_user
   },

   transaction : {
      create: post_new_transaction,
      getAll: retrieve_all_transactions,
      update: update_user_transaction,
      delete: delete_user_transaction
   },

   util : {
      entropyStr: newRandStr
   }
};
