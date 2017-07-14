/*************************************************************
* modules we would like to include
*************************************************************/
var express    = require('express');
var session = require('express-session');
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
var _secret_ =  "TEST" || db.util.entropyStr(".SESSION");
app.use(session({
  secret: _secret_,
  resave: false,
  saveUninitialized: true
}));
console.log("\n\n\nSession Secret:\t"+ _secret_);


/*************************************************************
* Configure the default page for the user
*************************************************************/
app.get('/', function(request, response) {
   if (request.session.user) {
      response.sendFile(__dirname + '/private/main.html');
	} else {
      response.render("pages/login", {error : ""});
   }
});

/*************************************************************
*
*************************************************************/
app.post('/app', function(request, response) {
   db.user.validate(request.body, function (err, data) {
      if (err) {
         response.write(err);
         response.end();
      } else {
         console.log(data);
         if (data.valid) {
            request.session.user = request.body.username;
            request.session.account_id = data.account_id;
            request.session.connection_code = data.connection_code;
            response.sendFile(__dirname + '/private/main.html');
         } else {
            response.render("pages/login", {
               error : "Invalid username or password."
            });
         }
      }
   });
});

/*************************************************************
*
*************************************************************/
app.get('/app', function(request, response) {
   if (request.session.user) {
      response.sendFile(__dirname + '/private/main.html');
	} else {
      response.render("pages/login", {error : ""});
   }
});

/*************************************************************
*
*************************************************************/
app.get('/logout', function(request, response) {
	if (request.session.user) {
		request.session.destroy();
	}
   response.render("pages/login", {error : ""});
});

/*************************************************************
*
*************************************************************/
app.get('/login', function(request, response) {
   if (request.session.user) {
      response.sendFile(__dirname + '/private/main.html');
	} else {
      response.render("pages/login", {error : ""});
   }
});

/*************************************************************
*
*************************************************************/
app.post('/signup', function(request, response) {
   // response.json({page:"signup", data:request.body});
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
app.post('/user/exists', function(request, response) {
   console.log(request.url);
   db.user.exists(request.body, function (err, data) {
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
   request.body.account_id = request.session.account_id;
   request.body.username = request.session.user;
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
   db.transaction.getAll({
         account_id: request.session.account_id
      }, function (err, data) {
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
app.post('/transaction/update', function(request, response) {
   console.log(request.url);
   request.body.account_id = request.session.account_id;
   request.body.username = request.session.user;
   db.transaction.update(request.body, function (err, data) {
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
app.post('/transaction/delete', function(request, response) {
   console.log(request.url);
   request.body.account_id = request.session.account_id;
   request.body.username = request.session.user;
   db.transaction.delete(request.body, function (err, data) {
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
app.get('/connection_code', function(request, response) {
   if (request.session.user) {
      response.json({connection_code : request.session.connection_code});
	} else {
      response.render("pages/login", {error : "Nice Try"});
   }
});

/*************************************************************
* Initiate our server
*************************************************************/
app.listen(app.get('port'), function() {
   console.log('Node app is running on port', app.get('port'));
});
