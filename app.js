const express = require("express");
const session = require("express-session");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const { prisma } = require("./db/prisma");
const path = require("node:path");

const app = express();

const passport = require("./authentication/passport");
const indexRoute = require("./routes/indexRoute");
const signupRoute = require("./routes/signupRoute"); 
const loginRoute = require("./routes/loginRoute");
const driveRoute = require("./routes/driveRoute");
const faqRoute = require("./routes/faqRoute");


//connect ejs
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//connect to static files
const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));

//session 
app.use(session({
  secret: "me is pogi",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 365 * 24 * 60 * 60 * 1000 //expires with in a year
  },
  store: new PrismaSessionStore(
    prisma,
    {
      checkPeriod: 2 * 60 * 1000,
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined
    }
  )
}));

//invoke passport session for login persistent
app.use(passport.passportSession);

//body parser
app.use(express.urlencoded({ extended: true }));

//import passport
passport.passportLocalStrat;
passport.passportSerializeUser;
passport.passportDeserializeUser;


app.use((req, res, next) => {
  console.log("user: ", req.user);
  console.log("session: ", req.session);
  next();
});
//currentUser data avail to UI files
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});
//routes
app.use("/", indexRoute);
app.use("/sign-up", signupRoute);
app.use("/log-in", loginRoute);
app.use("/drive", driveRoute);
app.use("/faq", faqRoute);
app.post("/log-in", passport.passportAuth);
app.get("/log-out", (req, res, next) => {
req.logout((error) => {
    if (error) return next(error);

    res.redirect("/")
  });
})



//error middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({error: "Internal Server Error"})
});



const PORT = 3000
app.listen(PORT, () => console.log("Listening to PORT: " + PORT));