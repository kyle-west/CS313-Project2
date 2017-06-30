/*************************************************************
*
*************************************************************/
var buttons = {
   plus: function () {
      console.log(" [PLUS]  : ");
      clearNewRowForm();
      if (this.newrow_open) {
         $('#newrow').slideUp();
         document.getElementById('plus_btn_content').innerHTML = "+";
      } else {
         $('#newrow').slideDown();
         document.getElementById('plus_btn_content').innerHTML = "▲";
      }
      this.newrow_open = !this.newrow_open;
   },

   help: function () {
      console.log(" [HELP]  : ");
      toggleMenu('helpmenu');
   },

   trash: function () {
      console.log(" [TRASH] : ");
   },

   menu: function () {
      console.log(" [MENU]  : ");
      toggleMenu();
   },

   newrow_open: false
}
