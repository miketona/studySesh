const express = require("express");
const router = express.Router();
const findUser = require("../mongoFunctions/mongoFindInDeck");
const createNewUser = require("../mongoFunctions/newDoc");
const bcrypt = require("bcrypt");

router.get("/register", (req, res) => {
  res.locals.indexPage = true;
  res.locals.loggedOut = true;
  res.render("register");
});

//validate user information, compare username with database, and log account information to database if it passes
router.post("/register", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  let hashedPassword;
  const confirmPassword = req.body.confirmPassword;
  let errorMessage = String; //displayed at the top of the registration page if there is an error.
  let usernameAlreadyExists = false;

  //make sure username does not contain hyphen as we will use that for database functionality later on
  if (username.includes("-")) {
    errorMessage =
      "ERROR, Username can not contain a hyphen (-), please use a different username.";
    res.render("register", { errorMessage });
  }
  //require password to be at least 8 characters
  else if (password.length < 8) {
    //if not, re-render page with error message
    errorMessage = "Password must be at least 8 characters";
    res.locals.loggedOut = true;
    res.locals.indexPage = true;
    res.render("register", { errorMessage });
  }
  //Confirm that password field matches confirm password field
  else if (password !== confirmPassword) {
    //if not, re-render page with error message
    errorMessage = "ERROR, Passwords did not match, please try again";
    res.locals.loggedOut = true;
    res.locals.indexPage = true;
    res.render("register", { errorMessage });
  } else {
    //if passwords match, check to see if username already exists in database
    findUser("username", null, async (result) => {
      //check if the username is already taken
      result.forEach((element) => {
        if (req.body.username === element.username) {
          //re render registration page with error message
          usernameAlreadyExists = true;
          res.locals.loggedOut = true;
          res.locals.indexPage = true;
          errorMessage =
            "ERROR, username already exists, please try another username";
          res.render("register", { errorMessage });
        }
      });
      //if all of the tests pass, encrypt password and log user to the database
      if (!usernameAlreadyExists) {
        try {
          //encrypt password
          const salt = await bcrypt.genSalt();
          hashedPassword = await bcrypt.hash(password, salt);
          //log username and encrypted password to the database
          const insertion = { username: username, password: hashedPassword };
          createNewUser("flashCard", insertion, "username", () => {
            res.locals.loggedOut = true;
            res.redirect("/login");
          });
        } catch {
          res.status(500).send();
        }
      }
    });
  }
});

//login
router.get("/login", (req, res) => {
  if (!req.cookies.username) {
    res.locals.loggedOut = true;
    res.render("login");
  } else {
    res.redirect("/");
  }
});
//compare login credentials with database
router.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  let errorMessage = "Incorrect Username and/or password please try again.";
  let hashedPassword = String;
  let usernameIsCorrect = Boolean;
  let passwordIsCorrect = Boolean;
  //check username
  findUser("username", null, async (result) => {
    //check password
    result.forEach((element) => {
      if (element.username === username) {
        usernameIsCorrect = true;
        hashedPassword = element.password;
      }
    });
    try {
      if (
        (usernameIsCorrect = true) &&
        (await bcrypt.compare(password, hashedPassword))
      ) {
        //set username to cookie and return to index
        res.cookie("username", username);
        res.redirect("/");
      } else {
        //return with error, and disable logged in header
        res.locals.loggedOut = true;
        res.locals.indexPage = true;
        res.render("login", { errorMessage });
      }
    } catch {}
  });
});
module.exports = router;
