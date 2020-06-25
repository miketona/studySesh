const express = require("express");
const router = express.Router(); // mini router, used for routing
//const popupS = require("popups");
const mongoInsertCard = require("../mongoFunctions/newDoc");
const mongoCreateDeck = require("../mongoFunctions/newCollection");
const findInDeck = require("../mongoFunctions/mongoFindInDeck");
const createNewCard = require("../mongoFunctions/newDoc");

router.get("/card", (req, res) => {
  res.render("create");
});
//Route for creating a new deck, directs to html page containing form
router.get("/createDeck", (req, res) => {
  res.render("createDeck");
});
router.post("/createDeck", (req, res) => {
  const username = req.cookies.username;
  //use body parser middleware to assign form data to variables
  const deckName = username + "-" + req.body.deckName;
  const description = req.body.deckDescription;
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
  //make sure collection is created..?

  //assign first card as the deck description. This will be a trend for all decks so that it is easy to access the description, then we can just omit [0] from the study cards
});

//Route for creating a new card, directs to html page containing form
router.get("/createCard", (req, res) => {});

//After submitting form, use form contents to add to database
router.post("/createCard", (req, res) => {
  if (req.cookies.currentDeck) {
    const username = req.cookies.username;
    const currentDeck = username + "-" + req.cookies.currentDeck;
    //use body parser middleware to assign form data to variables
    const formAnswer = req.body.answer;
    const formQuestion = req.body.question;
    const formHint = req.body.hint;
    const cardName = req.body.cardName;
    const insertion = {
      cardName: cardName,
      question: formQuestion,
      hint: formHint,
      answer: formAnswer,
    };
    mongoInsertCard("flashCard", insertion, currentDeck, () => {
      res.redirect("/edit");
    }); //Function to insert data into database.
  } else {
    res.redirect("changeDeck");
  }
});

module.exports = router;
