const methodOverride=require('method-override');
const express = require('express');
const exphbs=require('express-handlebars');
const mongoose=require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const passport=require('passport');
const dotenv = require('dotenv');

dotenv.config();

const app=express();

//flash middleware
app.use(flash());

// passport config 
require('./config/passport')(passport);

//db config
const db=require('./config/database');

//express-session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  }));

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req,res,next){
    res.locals.success_msg=req.flash('success_msg');
    res.locals.error_msg=req.flash('error_msg');
    res.locals.user=req.user|| null;
    res.locals.error = req.flash('error');
    next();
});

//method-override middleware
app.use(methodOverride('_method'));

//connect to mongoose
mongoose.connect(db.mongoURI, { useNewUrlParser: true })
.then(()=>console.log('Connected'))
.catch(err=>console.log('Couldn\'t connect',err));

//handlebars middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//static folder
app.use(express.static(__dirname + '/public'));

//bodyParser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//load idea routes
const ideas=require('./routes/ideas');

//load user routes
const users=require('./routes/users');

//use idea routes
app.use('/ideas',ideas);

//use user routes
app.use('/users',users);

//index route
app.get('/',(req, res )=>{

        var title="welcome";
        var info="App to jot down video ideas";
        res.render('index',{

            title:title,
            info:info
        });
});

//about route
app.get('/about',(req, res )=>{

    res.render('about');
});

const port=process.env.PORT || 5000;

app.listen(port,()=>{

    console.log(`Listening on port ${port}`);
});

