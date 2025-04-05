const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const { prisma } = require("../db/prisma");

exports.getSignup = asyncHandler(async (req, res, next) => {
  res.render("sign-up", {
    title: "Sign up"
  });
});

exports.postSignup = asyncHandler(async (req, res, next) => {
  const { username } = req.body;
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  await prisma.user.create({
    data: {
      username: username,
      password: hashedPassword
    }
  });

  res.redirect("/");

});