var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');
app.use(cors());
var path = require('path');
let flash = require('express-flash');
let session = require('express-session');
const cookieSession = require('cookie-session');
var logger = require('morgan');


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/* GET home page. */
// app.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/img', express.static(__dirname + 'public/img'))
app.use('/js', express.static(__dirname + 'public/js'))

app.use(cookieSession({
  cookie: { maxAge: 60000 },
  store: new session.MemoryStore,
  saveUninitialized: true,
  resave: 'true',
  secret: 'secret'
}))
app.use(logger('dev'));
app.use(flash());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var UserRouter = require('./routes/usersRouter');
var NoteRouter = require('./routes/noteRouter');
var indexRouter = require('./routes/index');
var LoginRouter=require('./routes/login')
app.use('/users', UserRouter);
app.use('/note', NoteRouter);
app.use('/page', LoginRouter);

const port = 3000

app.listen(port, () => {
  console.log(`Node App is running on port ${port}`);
})
module.exports = app;
