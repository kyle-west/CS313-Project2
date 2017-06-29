/*************************************************************
* Add a new function to the native Date object
* SRC: https://stackoverflow.com/questions/3066586/get-string-in-yyyymmdd-format-from-js-date-object
*************************************************************/
Date.prototype.yyyymmdd = function() {
   var local = new Date(this);
   local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
   var mm = local.getMonth() + 1; // getMonth() is zero-based
   var dd = local.getDate();

   return [local.getFullYear(),
      (mm>9 ? '' : '0') + mm,
      (dd>9 ? '' : '0') + dd
   ].join('-');
};

/*************************************************************
* Add a new function to the native Date object
* SRC: https://stackoverflow.com/questions/6982692/html5-input-type-date-default-value-to-today
*************************************************************/
Date.prototype.toDateInputValue = (function() {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0,10);
});


/*************************************************************
* Add a new function to the native Number object
* made by me with some help from
* https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
*************************************************************/
Number.prototype.money = function () {
    var parts = this.toFixed(2).toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
};
