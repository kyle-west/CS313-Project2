/*************************************************************
* connect to database
*************************************************************/
var config = {
   user: 'postgres', //env var: PGUSER
   database: 'cs313', //env var: PGDATABASE
   password: '7510', //env var: PGPASSWORD
   host: 'localhost', // Server hosting the postgres database
   port: 5432
};
const { Pool } = require('pg');
const pool = new Pool(config);

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
*
*************************************************************/
function create_new_user(data, callback) {
   console.log(
      "########## CREATE NEW USER ##########\nDATA ::> " +
      "user:" + data.username + " | " +
      "pass:" + data.password + " | " +
      "code:" + data.connection_code.substr(0,15) + "..."
   );
   if (data.connection_code.length == 0) {
      var connection_code = newRandStr();
      console.log("===== CREATING ACCOUNT =====");
      pool.query("INSERT INTO accounts (name, connection_code) VALUES ($1, $2) RETURNING id;",
      [data.username + " Account", connection_code], (errA, resA) => {
         if (errA) {
            console.log("ERROR: " + JSON.stringify(errA));
         } else {
            console.log("RESULTS: " + JSON.stringify(resA));
            console.log("----- CREATING USER -----");
            var q = "INSERT INTO users2 (username, password, account_id) VALUES ($1,$2,$3) RETURNING id, account_id;";
            pool.query(q, [data.username, data.password, resA.rows[0].id], (errU, resU) => {
               if (errU) {
                  console.log("ERROR: " + JSON.stringify(errU));
               } else {
                  console.log("RESULTS: " + JSON.stringify(resU));
                  callback(errU, {
                     user: resU.rows[0].id,
                     account: resU.rows[0].account_id,
                     ccode: connection_code
                  });
               }
            });
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
            console.log("----- CREATING ATTACHED USER -----");
            var q = "INSERT INTO users2 (username, password, account_id) VALUES ($1,$2,$3) RETURNING id, account_id;";
            pool.query(q, [data.username, data.password, resA.rows[0].id], (errU, resU) => {
               if (errU) {
                  console.log("ERROR: " + JSON.stringify(errU));
               } else {
                  console.log("RESULTS: " + JSON.stringify(resU));
                  callback(errU, {
                     user: resU.rows[0].id,
                     account: resU.rows[0].account_id,
                     ccode: connection_code
                  });
               }
            });
         }
      });
   }
}

/*************************************************************
*
*************************************************************/
function validate_user(data, callback) {
   console.log(
      "VALIDATE USER ::> " +
      "user:" + data.username + " | " +
      "pass:" + data.password
   );
   var result = "";
   var err    = null;
   callback(err, result);
}

/*************************************************************
*
*************************************************************/
function post_new_transaction(data, callback) {
   console.log(
      "POST NEW TRANSACTION ::> " +
      "A_ID:" + data.account_id + " | " +
      "user:" + data.username + " | " +
      "amnt:" + data.amount + " | " +
      "note:" + data.notes
   );
   var result = "";
   var err    = null;
   callback(err, result);
}

/*************************************************************
*
*************************************************************/
function retrieve_all_transactions(data, callback) {
   console.log(
      "POST NEW TRANSACTION ::> " +
      "A_ID:" + data.account_id
   );
   var result = "";
   var err    = null;
   callback(err, result);
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
   var result = "";
   var err    = null;
   callback(err, result);
}

/*************************************************************
*
*************************************************************/
function delete_user_transaction(data, callback) {
   console.log(
      "POST NEW TRANSACTION ::> " +
      "T_ID:" + data.transaction_id + " | " +
      "user:" + data.username + " | " +
      "A_ID:" + data.account_id + " | "
   );
   var result = "";
   var err    = null;
   callback(err, result);
}

/*************************************************************
*
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
