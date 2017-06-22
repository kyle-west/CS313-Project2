// var config = {
//    user: process.env.PGUSER || 'postgres',
//    database: process.env.PGDATABASE || 'cs313',
//    password: process.env.PGPASSWORD || '7510',
//    host: 'localhost',
//    port: process.env.PGPORT || 5432
// };

function parse_DATBASE_URL(url) {
   url = url.replace("postgres://", "");
   var parsed = {};
   var store = "";
   for (var i = 0; i < url.length; i++) {
      if (!parsed.user && url[i] == ':') {
         parsed.user = store; store = "";
      } else if (!parsed.password && url[i] == '@') {
         parsed.password = store; store = "";
      } else if (!parsed.host && url[i] == ':') {
         parsed.host = store; store = "";
      } else if (!parsed.port && url[i] == '/') {
         parsed.port = store; store = "";
      } else {
         store += url[i];
      }
   }
   parsed.database = store;
   return parsed;
}


var testurl = "postgres://user:password@hostname:port/database-name";
var realurl = "postgres://ywwlmgtfysbkol:21d6fac9d3c1fc2f0ac87ac85c93a028baf1b0635a539395f9da3bf30b6614db@ec2-23-23-222-147.compute-1.amazonaws.com:5432/d78bniivhnf474";
console.log(parse_DATBASE_URL(testurl));
console.log(parse_DATBASE_URL(realurl));
