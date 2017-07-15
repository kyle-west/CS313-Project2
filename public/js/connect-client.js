/*************************************************************
* A generic function to send a POST request to our server.
*************************************************************/
function connect(url, data, success) {
   $.ajax({
      type: "POST",
      url: url,
      data: data,
      success: success,
      error: function () { userconsole("Lost Connection to Server"); },
      dataType: "text"
   });
}


/*************************************************************
* Constructs the request to get all the previous user
* transactions from the database. Then calls a function to
* organize the data returned.
*************************************************************/
var loadCount = 1;
function loadTable(updateUser = true) {
   console.log("Loading Data {"+(loadCount++)+"}");
   if (updateUser) userconsole("Loading Data...");

   connect("/transaction/getAll", {}, function (data) {
      constructTransactionTable(data);
      if (updateUser) userconsole("Up to date.", 5);
   });
}


/*************************************************************
* Organizes the data given from the database in a nice table
*************************************************************/
function constructTransactionTable(data) {
   data = JSON.parse(data);
   console.log(data);

   // the table header
   var trans = "<thead><tr>"
             +"<th>Date</th>"
             + "<th>Description</th>"
             + "<th>Amount</th>"
             + "<th class = 'delcol'></th>"
             + "</tr></thead><tbody id = 'table_content'>";

   var evenodd = false; // keep track of the row type for css

   // go through each item returned and evaluate
   data.rows.forEach(function (item, index) {
      // insert metadata into the row tag
      trans += "<tr id = '" + item.id + "' class = '"
             + (item.active ? "" : "inactiverow ")
             + (evenodd ? "even" : "odd") + "'>";

      // set up the date column
      var date = new Date(item.transdate).toLocaleDateString();
      trans += "<td class = 'date'>"
             + "<span ondblclick=\"editText(this,'date');\" "
             + "data-row-id = '" + item.id + "'>"
             + date + "</span></td>";

      // if the Description is empty, then we need to put a "placeholder" in
      // so that the user has something to click on to edit it.
      if (item.notes == null || item.notes.trim().length == 0) {
         item.notes = "<span class = 'placeholder'>"
                    + desc_placeholder + "</span>";
      }

      // set up the Description box column
      trans += "<td class = 'notes'>"
             + "<span ondblclick=\"editText(this);\" "
             + "data-row-id = '" + item.id + "'>"
             + item.notes + "</span></td>";

      // format and set up the money amount column
      item.amount = Number(item.amount);
      trans += "<td class ='amount "
             + ((item.amount >= 0) ? "pos" : "neg") + "'>"
             + "<span ondblclick=\"editText(this, 'number');\" "
             + "data-row-id = '" + item.id + "'>"
             + item.amount.money() + "</span></td>";

      // last but not least, set up the "hidden column" that has our
      // enable/disable buttons.
      trans += "<td onclick = 'deleteRow(this.parentElement);' "
             + "class = 'delcol' "
             + "title = " + (item.active ? "Disable" : "Enable") + ">"
             + (item.active ? "✖" : "✔") + "</td>";

      trans += "</tr>";    // end row
      evenodd = !evenodd;  // toggle our flag.
   });

   trans += "</tr></tbody>"; // we are done!

   // insert the whole table and update the ballance at the
   // top of the page.
   document.getElementById("table").innerHTML = trans;
   document.getElementById("ballance").innerHTML =
      "Total: &nbsp;&nbsp;<span class = 'total'>$&nbsp;" +
      computeBallance(data).money() + "</span>";
}


/*************************************************************
* Add up all the values in the table that are active to get the
* sum total of all the users expenses.
*************************************************************/
function computeBallance(data) {
   var ballance = 0;

   data.rows.forEach((item , index) => {
      if (item.active)
         ballance += Number(item.amount);
   });

   return ballance;
}


/*************************************************************
* When the user has completed filling out the PLUS menu, this
* function adds it to the database and reloads the table.
*************************************************************/
function commitRow(data, updateUser = true) {
   if (updateUser) userconsole("Saving Changes...");

   if (!data) {
      var amount = Math.abs(Number(document.getElementById('nr_amnt').value));
      if (document.getElementById('nr_type').value == "withdrawl") {
         amount = -1 * amount;
      }

      // prepare data for sending
      data = {
         amount: amount,
         notes: document.getElementById('nr_note').value,
         date : document.getElementById('nr_date').value.toString()
      };
   }
   console.log(data);

   // make the connection to the database with the new transaction
   connect("/transaction/create", data, (data) => {
      console.log("RESPONSE:\t" + data);
      data = JSON.parse(data);
      if (data.success) {
         if (updateUser) userconsole("Changes Saved", 5);
         loadTable(false);
      } else {
         if (updateUser) userconsole("Uable to Connect");
      }
   });

   clearNewRowForm(); // remove the info in the form to show user it sent
}


/*************************************************************
* When a user update a row in the table, this function handles
* the update request sent to the server.
*************************************************************/
function updateRow(eTextElem, updateUser = true, elemIsRow = false) {
   if (updateUser) userconsole("Sending Changes to Sever");

   var row;

   // some cases may send the row itself, and not a child of the row
   // so we have to see if we need to find the row.
   if (elemIsRow) {
      row = eTextElem;
   } else {
      row = eTextElem.parentElement.parentElement;
   }

   // prepare the data to send to the sever
   var data = {
      transaction_id: row.id,
      amount: Number(
         row.getElementsByClassName('amount')[0].innerText.replace(/,/g, "")
      ),
      date: parseLocaleDate(row.getElementsByClassName('date')[0].innerText),
      notes: row.getElementsByClassName('notes')[0].innerText,
      active: (!row.classList.contains("inactiverow"))
   };
   console.log(data);

   // make the request to update
   connect("/transaction/update", data, (data) => {
      console.log("RESPONSE:\t" + data);
      data = JSON.parse(data);
      if (data.success) {
         if (updateUser) userconsole("Changes Saved", 5);
         loadTable(false); // update the table when complete for pretty printing
      } else {
         if (updateUser) userconsole("Uable to Connect");
      }
   });
}


/*************************************************************
* When a user clicks the enable/disable button, "delete" the
* row by disabling it. Then update the server accordingly.
*************************************************************/
function deleteRow(rowElem, updateUser = true) {
   if (rowElem.classList.contains("inactiverow")) {
      rowElem.classList.remove("inactiverow");
   } else {
      rowElem.classList.add("inactiverow");
   }

   updateRow(rowElem, updateUser, true);
}


/*************************************************************
* In the Main Menu there is a feature to collect the connection
* code needed to add another user to their account. This
* function makes a request to the database to get that code.
*************************************************************/
function pullConnectionCode() {
   $.ajax({
      type: "GET",
      dataType: "text",
      url: "/connection_code",

      // when we get the data back, insert it into the form and show the user
      success: function (data) {
         data = JSON.parse(data);
         document.getElementById('ccode').innerHTML = data.connection_code;
         $("#inst_ccode").slideDown();
         $("#ccode").slideDown();
      },

      error: function () {
         userconsole("Lost Connection to Server");
      }
   });
}
