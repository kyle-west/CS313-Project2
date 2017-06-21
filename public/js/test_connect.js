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
      case 2:
         test_validate_user(callback);
      default: notest(callback);
   }
}


function test_new_user(callback, cc) {
   if (!cc) var cce = "";
   else cce = cc;

   var data = {
      username: "test"+(user_i++),
      password: "password",
      connection_code: cce
   };

   connect("/user/new",data,callback);
}

function test_validate_user(callback) {
   var data = {
      username: "test"+(user_i-1),
      password: "password"
   };
   connect("/user/validate",data,callback);
}

function notest(callback) {
   var data = {
      test: "NOT DEFINED"
   };
   callback(data);
}
