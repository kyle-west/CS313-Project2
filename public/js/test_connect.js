var user_i = 1;

var __connection_code__ = null;
var __USER__ = null;

function test(elem) {
   console.log("RUNNING TEST: " + elem.name);
   var callback = function (data) {
      data = JSON.parse(data);
      document.getElementById(elem.name).innerHTML = JSON.stringify(data);
      if (data.ccode) {
         __USER__ = data;
         __connection_code__ = data.ccode;
         console.log("CONCODE : "+__connection_code__);
      }
   }

   var code = null;
   switch (parseInt(elem.name)) {
      case 11:
         code = __connection_code__;
      case 1:
         test_new_user(callback, code); break;

      case 2: test_validate_user(callback); break;
      case 3: test_post_new_trans(callback); break;
      case 4: test_retrieve_all_trans(callback); break;
      case 5: test_update_user_trans(callback); break;
      case 6: test_delete_user_trans(callback); break;
   }
}

var trans_count = 1;
function test_post_new_trans(callback) {
   var data = {
      account_id: 1,
      username: "PERM",
      amount: -10.00,
      notes: "TEST transaction " + (trans_count++)
   };
   connect("/transaction/create", data, callback);
}

function test_retrieve_all_trans(callback) {
   var data = {
      account_id: 1
   };
   console.log(data);
   connect("/transaction/getAll", data, callback);
}

function test_update_user_trans(callback) {
   var data = {
      transaction_id: 4,
      account_id: 1,
      username: "PERM",
      amount: 5.55,
      notes: "Item Was Successfully Edited"
   };
   connect("/transaction/update", data, callback);
}

function test_delete_user_trans(callback) {
   var data = {
      transaction_id: 5,
      account_id: 1
   };
   connect("/transaction/delete", data, callback);
}

function test_new_user(callback, cc) {
   if (!cc) var cce = "";
   else cce = cc;

   var data = {
      username: "test"+(user_i++),
      password: "password",
      connection_code: cce
   };

   connect("/user/new", data, callback);
}

function test_validate_user(callback) {
   var data = {
      username: "test"+(user_i-1),
      password: "password"
   };
   connect("/user/validate", data, callback);
}

function notest(callback) {
   var data = {
      test: "NOT DEFINED"
   };
   callback(data);
}
