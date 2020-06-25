const express = require("express");
const router = express.Router();
const MongoClient = require("mongodb").MongoClient;
const uriGet = require("../mongoFunctions/mongoUri");
const uri = uriGet();
const mongoFind = require("../mongoFunctions/mongoFindInDeck");
const mongoGetDeckNames = require("../mongoFunctions/mongoFindAllDecks");
const deleteCard = require("../mongoFunctions/mongoDeleteDoc");

router.get("/edit", (req, res) => {
  const currentDeck = req.cookies.currentDeck;
  //if a deck has been selected
  if (req.cookies.currentDeck) {
    const username = req.cookies.username;
    let description; //will be assigned the description of the deck after database search
    let cardNamesList = []; //will be assigned the list of card names in the deck after database search
    mongoFind(currentDeck, username, (result) => {
      //assign deck description to variable and pass it to the template
      description = result[0].description;
      //assign card names to variable and pass it to the template
      for (let i = 1; i < result.length; i++) {
        const element = result[i];
        cardNamesList.push(element.cardName);
      }
      res.render("edit", { currentDeck, description, cardNamesList });
    });
  } else {
    res.redirect("changeDeck");
  }
});

//Render the page and have it display all of the decks that the user has created.
router.get("/changeDeck", (req, res) => {
  mongoGetDeckNames((result) => {
    const listOfAllCollections = result;
    //determine if the deck belongs to this user and send them to the template
    let listOfUsersCollections = [];
    listOfAllCollections.forEach((element, i) => {
      if (element.name.includes(req.cookies.username + "-")) {
        listOfUsersCollections.push(
          element.name.replace(req.cookies.username + "-", "")
        );
      }
    });
    res.render("changeDeck", { listOfUsersCollections });
  });
});
router.post("/changeDeck", (req, res) => {
  res.clearCookie("currentDeck");
  res.cookie("currentDeck", req.body.deckName);
  res.redirect("/");
});

//delete a card
router.post("/deleteCard", (req, res) => {
  const username = req.cookies.username;
  const currentDeck = username + "-" + req.cookies.currentDeck;
  deleteCard(currentDeck, req.body.cardName, () => {
    res.redirect("/edit");
  });
});
module.exports = router;
