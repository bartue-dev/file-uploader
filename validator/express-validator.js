const { body } = require("express-validator");

const emptyMsg = "must not be empty";
const confirmPwMg = "not match";


const validateSignUp = [
  body("username").trim()
    .notEmpty().withMessage(`Username ${emptyMsg}`),
  body("password").trim()
    .notEmpty().withMessage(`Password ${emptyMsg}`)
    .isLength({min: 3}).withMessage(`Password must be atleast 3 characters or more`),
  body("confirm-password").custom((value, { req }) => {
    return value === req.body.password
  }).withMessage(`Password ${confirmPwMg}`)
];

const validateCreateFolder = [
  body("folderName").trim()
    .notEmpty().withMessage("Invalid folder name")
    .isLength({min: 3}).withMessage("Folder name must be atleast 3 characters or more")
];

const validateCreateFile = [
  body("file").custom((value, {req}) => {
    return req.file ? true : false
  }).withMessage("Invalid file")
];


module.exports = {
  validateSignUp,
  validateCreateFolder,
  validateCreateFile
}


