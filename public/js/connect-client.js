/*************************************************************
*
*************************************************************/
function connect(url, data, success) {
   $.ajax({
      type: "POST",
      url: url,
      data: data,
      success: success,
      dataType: "text"
   });
}
