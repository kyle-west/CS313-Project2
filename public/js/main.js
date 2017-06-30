const desc_placeholder = "[Double Click to Add a Description]";

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


/***************************************************************
* GLOBAL key listeners used for the modal and edit texts
***************************************************************/
var esc_out = false;
window.onkeyup = function(e) {
   var key = e.keyCode ? e.keyCode : e.which;

   switch (key) {
      case 27: // escape key
         esc_out = true;
      case 13: // enter key
         var curent_edit = document.getElementsByClassName('edit_text')[0];
         if (curent_edit != null) {
            curent_edit.blur();
         }
         break;
   }
}

/***************************************************************
* Make the contents of an element become a text input for editing
* by the user.
***************************************************************/
function editText(elem, type = 'text') {
   // store text contents of element
   var text = elem.innerText;
   if (text == desc_placeholder) {
      text = '';
   }
   // replace the text with an input element.
   elem.innerHTML = "<input type = '"+type+"' class = 'edit_text' " +
      "value = '"+
         ((type == 'date') ?
            new Date(text).toDateInputValue()
         : text) +
      "' " + "data-original-text = '"+ text +"' " +
      ((type == 'number') ? "step = '0.01'" : "") +
      "onblur = 'change_doc_name(this, this.parentElement);'" +
      "onfocus = 'this.select();'/>";
   elem.childNodes[0].style.width =
      ((type == 'text') ? "100%" : "80%");
   elem.childNodes[0].style.backgroundColor = "white";
   elem.childNodes[0].style.textAlign =
      ((type == 'number') ? "right" : "left");
   elem.childNodes[0].focus();

   console.log("Editing text:   '" + text + "'");
}

/***************************************************************
* After a user attempts to edit text made changable by the
* editText function, return the contents to a regular element.
***************************************************************/
function change_doc_name(elem, parent) {
   // store the text originally returned by the server
   var original_text = elem.getAttribute("data-original-text");
   var type = elem.getAttribute("type");

   // compare if changes were made
   if (elem.value.trim().length > 0 && elem.value != original_text && !esc_out) {
      // submit changes and remove input tag
      // var val = parent.innerHTML = elem.value;
      var val = elem.value;
      switch (type) {
         case 'date':
            val = parseDate(val);
            break;
      }
      parent.innerHTML = val;
      updateRow(parent);
   } else {
      // ensure no changes were made
      if (elem.value.trim().length == 0) {
         original_text = "<span class = 'placeholder'>"+desc_placeholder+"</span>";
      }
      var val = parent.innerHTML = original_text;
      console.log("NO CHANGES MADE: '" + val + "'");
      esc_out = false;
   }
}


function parseDate(yyyymmdd) {
   var d = yyyymmdd.split('-');
   return [d[1],d[2],d[0]].join("/");
}

function parseLocaleDate(mm_dd_yyyy) {
   var d = mm_dd_yyyy.split('/');
   return [
      d[2],
      ("00"+d[0]).slice(-2),
      ("00"+d[1]).slice(-2)
   ].join("-");
}

function toggleMenu(menu_id = 'menu') {
   if (menu_id == 'menu') {
      if ($('#helpmenu').is(":visible"))
         $('#helpmenu').slideUp();

      if ($('#menu').is(":visible"))
         $('#content').slideDown();
      else {
         $('#content').slideUp();
      }
   } else {
      $('#content').slideToggle();
   }
   
   $('#' + menu_id).slideToggle();
}
