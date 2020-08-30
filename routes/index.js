const express = require("express");
const router = express.Router(); // mini router, used for routing
//import mongoFunctions
//create route
router.get("/", (req, res) => {
  res.locals.indexPage = true;
  console.log(req.cookies.currentDeck);
  // res.send("<h1> This be my homepage </h1>"); // response.send() sends a message to the client
  const username = req.cookies.username;
  //check if user already has a deck, if so pass it to template so they can access the edit deck button.
  let deckExists;
  if (req.cookies.currentDeck) {
    deckExists = req.cookies.currentDeck;
  }
  if (username) {
    res.render("index", { username, deckExists });
  } else {
    res.redirect("/login");
  }
});

//logout button,  clear cookies and redirect to the login page
router.post("/logout", (req, res) => {
  res.clearCookie("username");
  res.clearCookie("currentDeck");
  res.redirect("/login");
});

module.exports = router;
