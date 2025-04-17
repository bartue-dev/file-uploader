const asyncHandler = require("express-async-handler");


exports.getFaq = asyncHandler(async (req, res, next) => {

  res.render("faq", {
    title: "FAQ"
  });
});