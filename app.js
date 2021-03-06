const   express = require("express"),
        bodyParser = require("body-parser"),
        mongoose = require("mongoose"),
        passport = require('passport'),
        passportLocal = require('passport-local'),
        passportLocalMongoose = require('passport-local-mongoose'),
        methodOverride = require('method-override'),
        flash = require('connect-flash');
        path = require('path'),
        // ----------------Model----------------------
        User = require('./models/user'),
        Resume = require('./models/resume'),
        // ------------------------------------------------
        indexRouter = require('./routes/index'),
        projectRouter = require('./routes/project');
        portfolioRouter = require('./routes/portfolio'),
        userRouter = require('./routes/user');
        adminRouter = require('./routes/admin');
        // templateRouter = require('./routes/template');
        

let app = express();

mongoose.connect('mongodb+srv://dnazzx:10259290@cluster0-vxqfa.mongodb.net/portfolio?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set('useUnifiedTopology',true);
mongoose.set('useCreateIndex',true);
mongoose.set('useFindAndModify',false);

app.use(bodyParser.urlencoded({extended: true}));
app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());

app.use(require('express-session')({
    secret: 'portfolio',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(function(req,res,next){
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    res.locals.currentUser = req.user;
    res.locals.messages = require('express-messages')(req, res);
    next();
});

passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// function isLoggedIn(req,res,next){
//     if(req.isAuthenticated()){
//         return next();
//     }
//     res.redirect('/login');
// }


app.get("*",function(req,res,next){
    res.locals.user = req.user || null;
    next();
});

//routes
app.use('/',indexRouter);
app.use('/project',projectRouter);
app.use('/portfolio',portfolioRouter);
app.use('/user',userRouter);
app.use('/admin',adminRouter);
// app.use('/template',templateRouter);

const port = process.env.PORT || 3000

//start server
app.listen(port, function(req,res){
    console.log('Portfolio has started!');
});









