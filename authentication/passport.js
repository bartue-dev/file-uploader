const { prisma } = require("../db/prisma");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const passportSession = passport.session();

const localStratCb = async (req, username, password, done) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        username: username 
      }
    });

    req.session.messages = [];

    if (!user){
      return done(null, false, {message: "Incorrect username"});
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return done(null, false, {message: "Incorrect Password"});
    }

    return done(null, user);

  } catch (error) {
    return done(error);
  }
}; 

const deserializeUserCb = async (id, done) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        id: id
      }
    });

    done(null, user);

  } catch (error) {
    done(error);
  }
};

const passportLocalStrat = passport.use(new LocalStrategy({passReqToCallback: true}, localStratCb));

const passportSerializeUser = passport.serializeUser((user, done) => {
  done(null, user.id)
});

const passportDeserializeUser = passport.deserializeUser(deserializeUserCb);

const passportAuth = passport.authenticate("local", {
  successRedirect: "/home",
  failureRedirect: "/",
  failureMessage: true
});

module.exports = {
  passportSession,
  passportLocalStrat,
  passportSerializeUser,
  passportDeserializeUser,
  passportAuth
}