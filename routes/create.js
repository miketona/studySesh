const express = require("express");
const router = express.Router(); // mini router, used for routing
//const popupS = require("popups");
const mongoInsertCard = require("../mongoFunctions/newDoc");
const mongoCreateDeck = require("../mongoFunctions/newCollection");
const findInDeck = require("../mongoFunctions/mongoFindInDeck");
const createNewCard = require("../mongoFunctions/newDoc");
const mongoFind = require("../mongoFunctions/mongoFindInDeck");
const mongoGetDeckNames = require("../mongoFunctions/mongoFindAllDecks");

//delete this?
router.get("/card", (req, res) => {
  res.render("create");
});
//Route for creating a new deck, directs to html page containing form
router.get("/createDeck", (req, res) => {
  //route will be redirected with this query param, if that happens this message will be passed to the site.
  const { errorMessage } = req.query;
  if (errorMessage === "yes") {
    res.locals.errorMessage =
      "Error: deck name has already been created please try again";
  }

  const username = req.cookies.username;
  if (username) {
    res.render("createDeck");
  } else {
    res.redirect("/login");
  }
});
router.post("/createDeck", (req, res) => {
  const username = req.cookies.username;
  let alreadyCreated = false;
  //use body parser middleware to assign form data to variables
  const deckName = username + "-" + req.body.deckName;
  const description = req.body.deckDescription;
  //see if deck name already exists, if it does reject the entry with an errormessage
  console.log("here");
  mongoGetDeckNames((result) => {
    const listOfAllCollections = result;
    //determine if the deck belongs to this user and send them to the template
    listOfAllCollections.forEach((element, i) => {
      if (element.name === deckName) {
        console.log("alreadyExists");
        alreadyCreated = true;
      }
    });
    if (alreadyCreated === false) {
      insertion = { description: description };
      //create collection based on name
      mongoCreateDeck("flashCard", deckName, () => {
        mongoInsertCard("flashCard", insertion, deckName, () => {
          if (req.cookies.currentDeck) {
            res.clearCookie(req.cookies.currentDeck);
            res.cookie("currentDeck", req.body.deckName);
          } else {
            res.cookie("currentDeck", req.body.deckName);
          }
          //Save deckName that user sees in cookies here.
          res.redirect("/edit");
        });
      });
    } else {
      res.redirect("/createDeck" + "?errorMessage=yes");
    }
  });
  //make sure collection is created..?

  //assign first card as the deck description. This will be a trend for all decks so that it is easy to access the description, then we can just omit [0] from the study cards
});

//Route for creating a new card, directs to html page containing form
router.get("/createCard", (req, res) => {
  const username = req.cookies.username;
  console.log(username);
  if (username) {
    const { errorMessage } = req.query;
    if (errorMessage === "yes") {
      res.locals.errorMessage =
        "Error: card name has already been created please try again with a different card name";
    }
    res.render("createCard");
  } else {
    res.redirect("/login");
  }
});

//After submitting form, use form contents to add to database
router.post("/createCard", (req, res) => {
  //redirect if accessed directly by user who is not logged in
  if (req.cookies.currentDeck) {
    let alreadyExists = false;
    const username = req.cookies.username;
    const currentDeck = username + "-" + req.cookies.currentDeck;
    console.log(currentDeck);
    //use body parser middleware to assign form data to variables
    const formAnswer = req.body.answer;
    const formQuestion = req.body.question;
    const formHint = req.body.hint;
    const cardName = req.body.cardName;

    //check if cardname already exists and if it does, then
    mongoFind(req.cookies.currentDeck, username, (result) => {
      //assign deck description to variable and pass it to the template
      //assign card names to variable and pass it to the template
      console.log(result);
      for (let i = 1; i < result.length; i++) {
        const element = result[i];
        console.log("hello");
        console.log(element.cardName);
        console.log("USER " + cardName);
        if (element.cardName === cardName) {
          alreadyExists = true;
        }
      }
      if (alreadyExists) {
        res.redirect("/createCard" + "?errorMessage=yes");
      } else {
        //create insertion and send it to the database
        const insertion = {
          cardName: cardName,
          question: formQuestion,
          hint: formHint,
          answer: formAnswer,
        };
        mongoInsertCard("flashCard", insertion, currentDeck, () => {
          res.redirect("/edit");
        });
      }
    });
  } else {
    res.redirect("changeDeck");
  }
});

module.exports = router;
