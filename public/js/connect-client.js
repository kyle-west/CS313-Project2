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
      account_id: 1
   };

   connect("/transaction/getAll", data, function (data) {
      constructTransactionTable(data);
      if (updateUser) userconsole("Up to date.",3);
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
      "</tr></thead><tbody id = 'table_content'>";

   var evenodd = false;
   data.rows.forEach(function (item, index) {
      trans += "<tr id = '"+item.id+"' class = '"+
         (evenodd ? "even" : "odd") +"'>";

      // trans += "<td class = 'date'>" +
      //    (new Date(item.transdate).toLocaleDateString()) +
      //    "</td>";


      trans += "<td class = 'notes'>"+
         "<span ondblclick=\"editText(this,'date');\" data-row-id = '"+item.id+"'>" +
         (new Date(item.transdate).toLocaleDateString()) + "</span></td>";

      trans += "<td class = 'date'>"+
         "<span ondblclick=\"editText(this);\" data-row-id = '"+item.id+"'>" +
         item.notes + "</span></td>";

      item.amount = Number(item.amount);
      trans += "<td class ='amount "+
         ((item.amount >= 0) ? "pos" : "neg") +"'>" +
         "<span ondblclick=\"editText(this, 'number');\" data-row-id = '"+item.id+"'>" +
         item.amount.money() + "</span></td>";

      trans += "</tr>";

      evenodd = !evenodd;
   });
   trans += "</tr></tbody>";

   document.getElementById("table").innerHTML = trans;
   document.getElementById("ballance").innerHTML =
      "Total: &nbsp;&nbsp;<span class = 'total'>$ " +
      computeBallance(data).money() + "</span>";
}

/*************************************************************
*
*************************************************************/
function computeBallance(data) {
   var ballance = 0;
   data.rows.forEach((item , index) => {
      ballance += Number(item.amount);
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
         account_id: 1,
         username: "PERM",
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
         if (updateUser) userconsole("Changes Saved");
         loadTable(false);
      } else {
         if (updateUser) userconsole("Uable to Connect");
      }
   });

   clearNewRowForm();
}
