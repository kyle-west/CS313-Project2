/***************************************************************
* AJAX request to see if the username given is taken or not.
***************************************************************/
function testForUser () {
   var username = document.getElementById('usrn').value;

   if (username.length > 0) {
      console.log("Checking if '" + username + "' is taken.");
      $.ajax({
         type: "POST",
         url: "/user/exists",
         data: {username: username},

         success:  function (data) {
            data = JSON.parse(data);
            if (data.exits) {
               document.getElementById('err1').innerHTML = "Username is taken";
            } else {
               document.getElementById('err1').innerHTML = "";
            }
            console.log(data);
         },

         dataType: "text"
      });
   } else {
      document.getElementById('err1').innerHTML = "";
   }
}


/***************************************************************
* Check that the passwords match and are at least 8 characters
***************************************************************/
function checkPass(elem) {
   // collect needed elements
   var pass1 = document.getElementById('pass1');
   var pass2 = document.getElementById('pass2');
   var errmsg = document.getElementById('errP');

   // return flag
   var okPass = true;

   // check the user defined Passwords
   if (pass1.value != pass2.value && pass2.value.length != 0) {
      if (elem && elem === pass2)
         errmsg.innerHTML = "Passwords Do Not Match";
      okPass = false;
   } else if (pass1.value.length < 8 && pass1.value.length != 0) {
      if (elem && elem === pass1)
         errmsg.innerHTML = "Passwords must be at least 8 characters";
      okPass = false;
   } else {
      errmsg.innerHTML = "";
   }

   return okPass && pass1.value.length != 0;
}


/***************************************************************
* See if the required parts of our form are filled out.
***************************************************************/
function validate () {
   return checkPass() &&
          (document.getElementById('err1').innerHTML.length == 0) &&
          (document.getElementById('usrn').value.length > 0);
}
