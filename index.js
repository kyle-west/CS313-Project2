/*************************************************************
* modules we would like to include
*************************************************************/
var express    = require('express');
var session    = require('express-session');
var bodyParser = require("body-parser");
var db         = require('./lib/connect.js');

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
var _secret_ =  db.util.entropyStr(".SESSION");
app.use(session({
  secret: _secret_,
  resave: false,
  saveUninitialized: true
}));
console.log("Session Secret:\t"+ _secret_);


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
* Set up the session. Route to main page, or redirect to login
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
* Users will often refresh pages. This GET request to the app
* allows the user to do so if they have already set up a session.
* otherwise, route to the login page.
*************************************************************/
app.get('/app', function(request, response) {
   if (request.session.user) {
      response.sendFile(__dirname + '/private/main.html');
	} else {
      response.render("pages/login", {error : ""});
   }
});

/*************************************************************
* Kill the session unconditionally (if exists)
*************************************************************/
app.get('/logout', function(request, response) {
	if (request.session.user) {
		request.session.destroy();
	}
   response.render("pages/login", {error : ""});
});

/*************************************************************
* Render the Login Screen
*************************************************************/
app.get('/login', function(request, response) {
   if (request.session.user) {
      response.sendFile(__dirname + '/private/main.html');
	} else {
      response.render("pages/login", {error : ""});
   }
});

/*************************************************************
* Render Sign up page
*************************************************************/
app.get('/signup', function(request, response) {
   response.render("pages/signup", {error : ""});
});

/*************************************************************
* Send the task to the database to add a new user to it.
*************************************************************/
app.post('/user/new', function(request, response) {
   db.user.create(request.body, function (err, data) {
      if (err) {
         response.write(err);
      } else {
         response.redirect('/login');
      }
      response.end();
   });
});

/*************************************************************
* Ask the database to validate a username and password match.
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
* Ask the database if a username is taken or not
*************************************************************/
app.post('/user/exists', function(request, response) {
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
* Post a new transaction to the database.
*************************************************************/
app.post('/transaction/create', function(request, response) {
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
* Ask the database to give us all of a user's transactions
*************************************************************/
app.post('/transaction/getAll', function(request, response) {
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
* Send a task to the database to update a user's transaction.
*************************************************************/
app.post('/transaction/update', function(request, response) {
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
* Remove a whole row from the database. NOT RECOMMENDED.
* Disable the row an update instead.
*************************************************************/
app.post('/transaction/delete', function(request, response) {
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
* Get the connection code so that a use can share it with
* whom they please.
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
   console.log('MoneyBook app is running on port', app.get('port'));
});
