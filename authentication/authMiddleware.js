
//authentication middleware.
const isAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    next()
  } else {
    res.render("notLoginPage")
  }
}

module.exports = {
  isAuth
}