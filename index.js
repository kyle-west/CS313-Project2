/*************************************************************
* modules we would like to include
*************************************************************/
var express    = require('express');
var bodyParser = require("body-parser");
var db = require('./lib/connect.js');

/*************************************************************
* Create an express instance of our app.
*************************************************************/
var app = express();

/*************************************************************
* Connect to midleware, and set server values.
*************************************************************/
app.set('port', (process.env.PORT || 5000));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/*************************************************************
* Configure the default page for the user
*************************************************************/
app.get('/', function(request, response) {
   response.sendFile(__dirname + '/public/test.html');
});

/*************************************************************
*
*************************************************************/
app.post('/user/new', function(request, response) {
   db.user.create(request.body, function (err, data) {
      if (err) {
         response.write(err);
      } else {
         response.json(data);
      }
      response.end();
   });
});

/*************************************************************
*
*************************************************************/
app.post('/user/validate', function(request, response) {
   db.user.validate(request.body, function (err, data) {
      if (err) {
         response.write(err);
      } else {
         response.json(data);
      }
      response.end();
   });
});

/*************************************************************
*
*************************************************************/
app.post('/transaction/create', function(request, response) {
   console.log(request.url);
   db.transaction.create(request.body, function (err, data) {
      if (err) {
         response.write(err);
      } else {
         response.json(data);
      }
      response.end();
   });
});

/*************************************************************
*
*************************************************************/
app.post('/transaction/getAll', function(request, response) {
   console.log(request.url);
   // db.transaction.getAll(request.body, function (err, data) {
   //    if (err) {
   //       response.write(err);
   //    } else {
   //       response.json(data);
   //    }
   //    response.end();
   // });
});

/*************************************************************
*
*************************************************************/
app.post('/transaction/update', function(request, response) {
   console.log(request.url);
   // db.transaction.update(request.body, function (err, data) {
   //    if (err) {
   //       response.write(err);
   //    } else {
   //       response.json(data);
   //    }
   //    response.end();
   // });
});

/*************************************************************
*
*************************************************************/
app.post('/transaction/delete', function(request, response) {
   console.log(request.url);
   // db.transaction.delete(request.body, function (err, data) {
   //    if (err) {
   //       response.write(err);
   //    } else {
   //       response.json(data);
   //    }
   //    response.end();
   // });
});

/*************************************************************
* Initiate our server
*************************************************************/
app.listen(app.get('port'), function() {
   console.log('Node app is running on port', app.get('port'));
});
