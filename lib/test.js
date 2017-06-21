function newRandStr(id) {
   if (!id) id = "";
   var len = 150 + Math.floor(Math.random() * 154);
   var str = "";
   var set = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
   for( var i = 0; i < len; i++ )
   str += set.charAt(Math.floor(Math.random() * set.length));
   return str + id;
}

console.log(newRandStr(1));
console.log(newRandStr(2));
console.log(newRandStr(3));
console.log(newRandStr(4));
console.log(newRandStr(5));
console.log(newRandStr());
