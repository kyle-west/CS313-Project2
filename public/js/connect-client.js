/*************************************************************
*
*************************************************************/
function create_new_user(data, success) {
   $.ajax({
      type: "POST",
      url: "/user/new",
      data: data,
      success: success,
      dataType: "text"
   });
}

/*************************************************************
*
*************************************************************/
function validate_user(username, password) {

}

/*************************************************************
*
*************************************************************/
function post_new_transaction(account_id, username, amount, notes) {

}

/*************************************************************
*
*************************************************************/
function retrieve_all_transactions(account_id) {

}

/*************************************************************
*
*************************************************************/
function update_user_transaction(transaction_id, username, account_id, amount, notes) {

}

/*************************************************************
*
*************************************************************/
function delete_user_transaction(transaction_id, username, account_id) {

}
