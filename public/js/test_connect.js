var user_i = 0;

var __connection_code__ = null;

function test(elem) {
   console.log("RUNNING TEST: " + elem.name);
   var callback = function (data) {
      data = JSON.parse(data);
      document.getElementById(elem.name).innerHTML =
         JSON.stringify(data);
      if (data.ccode) __connection_code__ = data.ccode;
      console.log("CONCODE : "+__connection_code__);
   }

   var code = null;
   switch (parseInt(elem.name)) {
      case 11:
         code = __connection_code__;
      case 1:
         test_new_user(callback, code); break;
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
   create_new_user(data,callback);
}

function notest(callback) {
   var data = {
      test: "NOT DEFINED"
   };

   callback(data);
}
