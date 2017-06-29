/*************************************************************
*
*************************************************************/
var buttons = {
   plus: function () {
      console.log(" [PLUS]  : ");
      clearNewRowForm();
      $('#newrow').slideDown();
   },

   help: function () {
      console.log(" [HELP]  : ");
   },

   trash: function () {
      console.log(" [TRASH] : ");
   }
}






// TODO remove at end of all this
buttons.qa = function (test) {
   console.log("\n\n\n######### QA ###########");
   switch (test) {
      case 1: // --------------------------------------------- POST NEW TRANS
         commitRow({
            account_id: 1,
            username: "PERM",
            amount: -156.23,
            notes: "This is a test",
            date : "2017-06-28"
         });
         break;
      default:
         console.log("       [No Action]      ");

   }
   console.log("########################");
}
