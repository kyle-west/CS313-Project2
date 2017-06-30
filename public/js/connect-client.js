/*************************************************************
*
*************************************************************/
function connect(url, data, success) {
   $.ajax({
      type: "POST",
      url: url,
      data: data,
      success: success,
      error: function () {
         userconsole("Lost Connection to Server");
      },
      dataType: "text"
   });
}

/*************************************************************
*
*************************************************************/
var loadCount = 1;
function loadTable(updateUser = true) {
   console.log("Loading Data {"+(loadCount++)+"}");
   if (updateUser) userconsole("Loading Data...");
   // TODO: validate user and get actual id
   var data = {
      account_id: _USER_.account_id
   };

   connect("/transaction/getAll", data, function (data) {
      constructTransactionTable(data);
      if (updateUser) userconsole("Up to date.", 5);
   });
}

/*************************************************************
*
*************************************************************/
function constructTransactionTable(data) {
   data = JSON.parse(data);
   console.log(data);
   var trans = "<thead><tr>" +
      "<th>Date</th>" +
      "<th>Description</th>" +
      "<th>Amount</th>" +
      "<th class = 'delcol'></th>" +
      "</tr></thead><tbody id = 'table_content'>";

   var evenodd = false;
   data.rows.forEach(function (item, index) {
      trans += "<tr id = '"+item.id+"' class = '"+
         (item.active ? "" : "inactiverow ") +
         (evenodd ? "even" : "odd") +"'>";

      trans += "<td class = 'date'>"+
         "<span ondblclick=\"editText(this,'date');\" data-row-id = '"+item.id+"'>" +
         (new Date(item.transdate).toLocaleDateString()) + "</span></td>";

      if (item.notes == null || item.notes.trim().length == 0) {
         item.notes = "<span class = 'placeholder'>"+desc_placeholder+"</span>";
      }

      trans += "<td class = 'notes'>"+
         "<span ondblclick=\"editText(this);\" data-row-id = '"+item.id+"'>" +
         item.notes + "</span></td>";

      item.amount = Number(item.amount);
      trans += "<td class ='amount "+
         ((item.amount >= 0) ? "pos" : "neg") +"'>" +
         "<span ondblclick=\"editText(this, 'number');\" data-row-id = '"+item.id+"'>" +
         item.amount.money() + "</span></td>";

      trans += "<td class = 'delcol' onclick = 'deleteRow(this.parentElement);' "+
         "title = " + (item.active ? "Disable" : "Enable") + ">"+
         (item.active ? "✖" : "✔") + "</td>";

      trans += "</tr>";

      evenodd = !evenodd;
   });
   trans += "</tr></tbody>";

   document.getElementById("table").innerHTML = trans;
   document.getElementById("ballance").innerHTML =
      "Total: &nbsp;&nbsp;<span class = 'total'>$&nbsp;" +
      computeBallance(data).money() + "</span>";
}

/*************************************************************
*
*************************************************************/
function computeBallance(data) {
   var ballance = 0;
   data.rows.forEach((item , index) => {
      if (item.active) ballance += Number(item.amount);
   });
   return ballance;
}

/*************************************************************
*
*************************************************************/
function commitRow(data, updateUser = true) {
   if (updateUser) userconsole("Saving Changes...");

   if (!data) {
      var amount = Math.abs(Number(document.getElementById('nr_amnt').value));
      if (document.getElementById('nr_type').value == "withdrawl") {
         amount = -1 * amount;
      }

      // TODO: validate user and get actual id and username
      data = {
         account_id: _USER_.account_id,
         username: _USER_.username,
         amount: amount,
         notes: document.getElementById('nr_note').value,
         date : document.getElementById('nr_date').value.toString()
      };
   }
   console.log(data);

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

   clearNewRowForm();
}

/*************************************************************
*
*************************************************************/
function updateRow(eTextElem, updateUser = true, elemIsRow = false) {
   if (updateUser) userconsole("Sending Changes to Sever");

   var row;
   if (elemIsRow) {
      row = eTextElem;
   } else {
      row = eTextElem.parentElement.parentElement;
   }

   var data = {
      transaction_id: row.id,
      account_id: _USER_.account_id,
      username: _USER_.username,
      amount: Number(row.getElementsByClassName('amount')[0].innerText),
      date: parseLocaleDate(row.getElementsByClassName('date')[0].innerText),
      notes: row.getElementsByClassName('notes')[0].innerText,
      active: (!row.classList.contains("inactiverow"))
   };

   console.log(data);
   connect("/transaction/update", data, (data) => {
      console.log("RESPONSE:\t" + data);
      data = JSON.parse(data);
      if (data.success) {
         if (updateUser) userconsole("Changes Saved",5);
         loadTable(false);
      } else {
         if (updateUser) userconsole("Uable to Connect");
      }
   });
}


/*************************************************************
*
*************************************************************/
function deleteRow(rowElem, updateUser = true) {
   if (rowElem.classList.contains("inactiverow")) {
      rowElem.classList.remove("inactiverow");
   } else {
      rowElem.classList.add("inactiverow");
   }

   updateRow(rowElem, updateUser, true);
}
