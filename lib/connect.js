/*************************************************************
* connect to database
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
*
*************************************************************/
function validate_user(data, callback) {
   console.log(
      "\n\n########## VALIDATE USER  ##########\nDATA ::> " +
      "user:" + data.username + " | " +
      "pass:" + data.password +
      "\n------------------------------------------------------------------"
   );
   var q = "SELECT id FROM users2 WHERE username = $1 AND password = $2;";
   pool.query(q, [data.username, data.password], (err, res) => {
      if (err)
         console.log("ERROR: " + JSON.stringify(err));
      else {
         console.log("RESULTS: " + JSON.stringify(res));
         var found = (res.rows.length == 1);
         callback(err, {
            user: data.username,
            valid : found
         });
      }
   });
}

/*************************************************************
*
*************************************************************/
function post_new_transaction(data, callback) {
   console.log(
      "\n\nPOST NEW TRANSACTION ::> " +
      "A_ID:" + data.account_id + " | " +
      "user:" + data.username + " | " +
      "amnt:" + data.amount + " | " +
      "date:" + data.date + " | " +
      "note:" + data.notes
   );
   var q = "INSERT INTO transactions (account_id, user_id, amount, notes, transdate) VALUES " +
           "($1, (SELECT id FROM users2 WHERE username = $2), $3, $4, $5) RETURNING id;";
   pool.query(q, [data.account_id, data.username, data.amount, data.notes, data.date], (err, res) => {
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
*
*************************************************************/
function retrieve_all_transactions(data, callback) {
   console.log(
      "RETRIEVE ALL TRANSACTIONS ::> " +
      "A_ID:" + data.account_id
   );
   var q = "SELECT * FROM transactions WHERE account_id = $1 ORDER BY transdate DESC, id DESC";
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
*
*************************************************************/
function update_user_transaction(data, callback) {
   console.log(
      "POST NEW TRANSACTION ::> " +
      "T_ID:" + data.transaction_id + " | " +
      "user:" + data.username + " | " +
      "A_ID:" + data.account_id + " | " +
      "amnt:" + data.amount + " | " +
      "note:" + data.notes
   );
   var q = "UPDATE transactions SET user_id = (SELECT id FROM users2 WHERE username = $1), "
         + "amount = $2, notes = $3 WHERE id = $4 AND account_id = $5 RETURNING id;";
   pool.query(q, [data.username,data.amount,data.notes,data.transaction_id,data.account_id],
      (err, res) => {
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
*
*************************************************************/
function delete_user_transaction(data, callback) {
   console.log(
      "POST NEW TRANSACTION ::> " +
      "T_ID:" + data.transaction_id + " | " +
      "A_ID:" + data.account_id
   );
   var q = "DELETE FROM transactions WHERE id = $1 AND account_id = $2 RETURNING id;";
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
* Generate a random conneciton code for the DB
*************************************************************/
function newRandStr(id) {
   if (!id) id = "";
   var len = 150 + Math.floor(Math.random() * 154);
   var str = "";
   var set = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
   for( var i = 0; i < len; i++ )
   str += set.charAt(Math.floor(Math.random() * set.length));
   return str + id;
}

/*************************************************************
* UNCONDITIONALLY create new user
*************************************************************/
function add_user(data, callback) {
   console.log("----- CREATING USER -----");
   var q = "INSERT INTO users2 (username, password, account_id) VALUES ($1,$2,$3) RETURNING id, account_id;";
   pool.query(q, [data.username, data.password, data.account], (err, res) => {
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
   if (data.connection_code.length == 0) {
      data.connection_code = newRandStr();
      console.log("===== CREATING ACCOUNT =====");
      pool.query("INSERT INTO accounts (name, connection_code) VALUES ($1, $2) RETURNING id;",
         [data.username + " Account", data.connection_code], (errA, resA) => {
         if (errA) {
            console.log("ERROR: " + JSON.stringify(errA));
         } else {
            console.log("RESULTS: " + JSON.stringify(resA));
            data.account = resA.rows[0].id;
            add_user(data, callback);
         }
      });
   } else {
      console.log("===== RETRIEVING ACCOUNT =====");
      pool.query("SELECT id FROM accounts WHERE connection_code = $1",
         [data.connection_code], (errA, resA) => {
         if (errA) {
            console.log("ERROR: " + JSON.stringify(errA));
         } else {
            console.log("RESULTS: " + JSON.stringify(resA));
            data.account = resA.rows[0].id;
            add_user(data, callback);
         }
      });
   }
}

/*************************************************************
* Our international Exports
*************************************************************/
module.exports = {
   user : {
      create: create_new_user,
      validate: validate_user
   },
   transaction : {
      create: post_new_transaction,
      getAll: retrieve_all_transactions,
      update: update_user_transaction,
      delete: delete_user_transaction
   }
};
