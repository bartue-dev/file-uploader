const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const { prisma } = require("../db/prisma");
const { validationResult } = require("express-validator");
const { validateSignUp } = require("../validator/express-validator")

exports.getSignup = asyncHandler(async (req, res, next) => {
  res.render("sign-up", {
    title: "Sign up",
    errors: []
  });
});

exports.postSignup = [ validateSignUp, asyncHandler(async (req, res, next) => {

  const errors = validationResult(req);
  const { username } = req.body;
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  if (!errors.isEmpty()) {
    return res.render("sign-up", {
      title: "Sign up",
      errors: errors.array()
    });
  }

  await prisma.user.create({
    data: {
      username: username,
      password: hashedPassword
    }
  });

  res.redirect("/");

})];