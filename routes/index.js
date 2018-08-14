var express = require('express');
var cookieParser = require('cookie-parser');
var router = express.Router();
var mongodb = require('mongodb');

var app = express();
app.use(cookieParser());

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'TutorNow'
  });
});

router.get('/login', function (req, res, next) {
  res.render('LoginThoth', {
    title: 'Login'
  });
});


router.get('/signup', function (req, res, next) {

  res.render('SignupThoth', {
    title: 'Sign up'
  });
});

router.get('/TutorHome', function (req, res, next) {
  if (req.cookies.email == null) {
    res.redirect('/signup');
  }
  var MongoClient = mongodb.MongoClient;

  var url = 'mongodb://localhost:27017/ThothDB';
  MongoClient.connect(url, function (err, db) {
    if (err) {
      console.log('Unable to connect to the server', err)
    } else {
      console.log('Connected to Server');

      var collection = db.db('ThothDB').collection('accounts');

      collection.find({
        "email": req.cookies.email
      }).toArray(function (err, result) {
        if (err) {
          console.log(err);
        } else {

          res.render('Tutorhome', {
            tutor: result,
          
          });

        }

      });
    }
  });
});

router.get('/home', function (req, res, next) {
  if (req.cookies.email == null) {
    res.redirect('/signup');
  }
  var MongoClient = mongodb.MongoClient;

  var url = 'mongodb://localhost:27017/ThothDB';
  MongoClient.connect(url, function (err, db) {
    if (err) {
      console.log('Unable to connect to the server', err)
    } else {
      console.log('Connected to Server');

      var collection = db.db('ThothDB').collection('accounts');

      collection.find({
        'email': req.cookies.email
      }).toArray(function (err, result) {
        if (err) {
          console.log(err);
        } else {

          console.log(result);
          collection.find({
            'radio': 'tutor'
          }).toArray(function (err, tutors) {
            if (err) {
              console.log(err);
            } else {

              console.log(result);

              res.render('home', {
                student: result[0],
                title: 'Home',
                tutors: tutors,
              });
            }


          })

        }

        //db.close();
      });
    }
  });

});

router.get('/list', function (req, res, next) {
  if (req.cookies.email == null) {
    res.redirect('/signup');
  }

  var MongoClient = mongodb.MongoClient;

  var url = 'mongodb://localhost:27017/ThothDB';

  MongoClient.connect(url, function (err, db) {
    if (err) {
      console.log('Unable to connect to the server', err)
    } else {
      console.log('Connected to Server');

      var collection = db.db('ThothDB').collection('accounts');

      collection.find({}).toArray(function (err, result) {
        if (err) {
          console.log(err);
        } else {
          res.render('list', {
            title: 'List',
            studentList: result
          })
        }




        db.close();
      });
    }
  });
});



// Route to the page we can add students from using newstudent.jade


router.post('/createAccount', function (req, res) {

  // Get a Mongo client to work with the Mongo server
  var MongoClient = mongodb.MongoClient;

  // Define where the MongoDB server is
  var url = 'mongodb://localhost:27017/ThothDB';

  // Connect to the server
  MongoClient.connect(url, function (err, db) {
    if (err) {
      console.log('Unable to connect to the Server:', err);
    } else {
      console.log('Connected to Server');

      // Get the documents collection
      var collection = db.db('ThothDB').collection('accounts');
      console.log(req.body.subject);
      // Get the student data passed from the form
      var newAccount = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        phonenumber: req.body.phonenumber,
        email: req.body.email,
        school: req.body.school,
        password: req.body.password,
        radio: req.body.radio,
        subject: req.body.subject
      };

      console.log(newAccount);

      // Insert the student data into the database
      collection.insert([newAccount], function (err, result) {
        if (err) {
          console.log(err);
        } else {

          // Redirect to the updated student list
          res.redirect("login");
        }

        // Close the database
        db.close();
      });
    }
  });

});

router.post('/requesttutor', function (req, res) {

  var MongoClient = mongodb.MongoClient;

  var url = 'mongodb://localhost:27017/Thothhb';

  MongoClient.connect(url, function (err, db) {
    if (err) {

    } else {
      var firstName = req.body.firstName;
      var lastName = req.body.lastName;
      var stuFirst = req.body.stufirstName;
      var stuLast = req.body.stulastName;
      var stuEmail = req.body.stuemail
      console.log('tutor: ' + firstName, lastName)
      console.log('student: ' + stuFirst, stuLast)
      collection = db.db('ThothDB').collection('accounts');

      collection.update({
        firstname: firstName,
        lastname: lastName
      }, {
        $push: {
          requests: {
            first: stuFirst,
            last: stuLast,
            email: stuEmail
          }
        }
      }, {
        function (err, result) {
          if (err) {
            res.redirect(req.get('referer'));
          } else {
            if (result) {
              res.redirect(req.get('referer'));
            }
          }
          db.close();
        }
      })
    }
  })
});


router.post('/deletecard', function (req, res) {

  var MongoClient = mongodb.MongoClient;

  var url = 'mongodb://localhost:27017/Thothhb';

  MongoClient.connect(url, function (err, db) {
    if (err) {

    } else {
      var lastName = req.body.last;
      var firstName = req.body.first;
      var email = req.body.Email;
      console.log('tutor name:', firstName, lastName);
      console.log('student email', email);
      collection = db.db('ThothDB').collection('accounts');

      collection.update({
        firstname: firstName,
        lastname: lastName
      }, {
        $pull: {
          requests: {
            email: email
          }
        }
      }, {
        function (err, result) {
          if (err) {
            res.redirect(req.get('referer'));
          } else {
            if (result) {
              res.redirect(req.get('/referer'));
            }
          }
          db.close();
        }
      })
    }
  })
});


router.post('/signout', function (req, res) {
  res.clearCookie("email");
  res.redirect('/');
})
router.post('/checkuser', function (req, res) {
  // Get a Mongo client to work with the Mongo server
  var MongoClient = mongodb.MongoClient;

  // Define where the MongoDB server is
  var url = 'mongodb://localhost:27017/Thothhb';

  // Connect to the server
  MongoClient.connect(url, function (err, db) {
    if (err) {
      console.log('Unable to connect to the Server:', err);
    } else {
      console.log('Connected to Server');

      var email = req.body.email;
      var password = req.body.password;
      var firstname = req.body.firstname;

      collection = db.db('ThothDB').collection('accounts');

      collection.findOne({
        email: email,
        password: password
      }, function (err, result) {
        if (err) {
          res.redirect('/login')
        } else {
          if (result) {
            console.log(result);
            // Setup cookies
            res.cookie("email", email);
            if (result.radio === 'student') {
              res.redirect('home');
            } else {
              res.redirect('Tutorhome')
            }
          } else {
            res.redirect('/signup');
          }
        }

        db.close();
      });

    }
  });

});



module.exports = router;