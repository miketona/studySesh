const express = require("express");
const router = express.Router();
const deleteCard = require("../mongoFunctions/mongoDeleteDoc");
const deleteDeck = require("../mongoFunctions/mongoDeleteCollection");
//delete a card
router.post("/deleteCard", (req, res) => {
  const username = req.cookies.username;
  const currentDeck = username + "-" + req.cookies.currentDeck;
  deleteCard(currentDeck, req.body.cardName, () => {
    res.redirect("/edit");
  });
});

router.post("/deleteDeck", (req, res) => {
  const username = req.cookies.username;
  const collectionName = username + "-" + req.body.deckName;
  console.log("deleted?");
  deleteDeck(collectionName, () => {
    res.clearCookie("currentDeck");
    res.redirect("/changeDeck");
  });
});

module.exports = router;
