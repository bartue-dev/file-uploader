const asyncHandler = require("express-async-handler");


exports.getLogin = asyncHandler(async (req, res, next) => {

  const loginErrMsg = req.session.messages

  if (!req.user) {
    res.render("log-in", {
      title: "Log in",
      loginErrMsg: loginErrMsg
    });
  } else {
    res.redirect("/drive")
  }
});