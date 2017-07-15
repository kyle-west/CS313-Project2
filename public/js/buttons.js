/*************************************************************
* BUTTONS Object. Defines the behavior of the buttons on screen.
*************************************************************/
var buttons = {
   /**********************************************************
   * Opens the menu to add another transaction to the books.
   **********************************************************/
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

   /**********************************************************
   * Show the help menu
   **********************************************************/
   help: function () {
      console.log(" [HELP]  : ");
      toggleMenu('helpmenu');
   },

   /**********************************************************
   * Show the main menu
   **********************************************************/
   menu: function () {
      console.log(" [MENU]  : ");
      toggleMenu();
   },

   /**********************************************************
   * Just a simple flag to help the PLUS button know if the
   * menu has been opened or not.
   **********************************************************/
   newrow_open: false
}
