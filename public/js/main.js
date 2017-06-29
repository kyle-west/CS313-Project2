/*************************************************************
*
*************************************************************/
function userconsole(msg, seconds) {
   var con = document.getElementById('userconsole');
   if (seconds) {
      con.innerHTML = msg;
      setTimeout(function(){ userconsole(); }, seconds*1000);
   } else if (msg) {
      con.innerHTML = msg;
   } else con.innerHTML = "";
}

/*************************************************************
*
*************************************************************/
function clearNewRowForm() {
   $('#nr_date').val(new Date().toDateInputValue());
   $('#nr_amnt').val(null);
   $('#nr_note').val("");
   $('#nr_type').val("withdrawl");
}
