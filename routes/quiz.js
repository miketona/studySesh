const express = require("express");
const router = express.Router();
const mongoFind = require("../mongoFunctions/mongoFindInDeck");

//Initial load quiz page
router.get("/", (req, res) => {
  const currentDeck = req.cookies.currentDeck;
  const username = req.cookies.username;
  //let description; //will be assigned the description of the deck after database search
  res.locals.cardName = 1;

  mongoFind(currentDeck, username, (result) => {
    //generate random number
    if (result.length > 1) {
      currentCard = Math.floor(Math.random() * (result.length - 1)) + 1; // generates random number between 1 and the result length
      data = result; //passes all of the card info to the quiz for first card
      for (let i = 1; i < data.length; i++) {
        data[i].cardNumber = i;
      }
      correct = false; //used for initialization into the quiz
      questionNumber = 1;
      questionNumberPost = 0;
      const totalPoints = result.length - 1;
      //added this so that the user can not alter the total points unlike with the query param
      data[0].totalPoints = result.length - 1;
      //load initial card with a score of 0 and an id equal to current card number
      res.redirect(
        "/quiz/" + currentCard + "?currentScore=0&totalPoints=" + totalPoints
      );
    } else {
      res.redirect("/edit");
    }
  });
  //const randNumb = Math.floor(Math.random() * dataLength); // returns a random integer from 0 to 9
  //redirect to rand number

  //res.redirect("/card/" + randNumb);
});

//render the correct card on the quiz page
router.get("/:id", (req, res) => {
  //if there are still flash cards in the deck
  if (data.length > 1) {
    const allCards = data;
    const { currentScore } = req.query; //will be used to keep score
    const { totalPoints } = req.query; //will be used to keep total amount of avalable points
    const { id } = req.params;
    //find the current card
    console.log(questionNumber);
    const currentCard = allCards[parseInt(id)];
    //pass variables to the the page and render it
    res.locals.cardName = currentCard.cardName;
    res.locals.question = currentCard.question;
    res.locals.answer = currentCard.answer;
    res.locals.currentScore = currentScore;
    res.locals.id = id;
    res.locals.totalPoints = totalPoints;
    res.locals.hint = currentCard.hint;
    res.locals.data = allCards;
    //QuestionNumber is incremented here and questionNumberPost is incremented after the form is submitted/on each submition. Thus if someone trys to cheat with the back button, then the code can detect it
    res.locals.questionNumber = questionNumber++;

    if (correct != false) res.locals.correct = correct;
    res.render("quiz");
  }
  //else, render the page as a results page
  else {
    let totalScore = 0;
    const currentDeck = req.cookies.currentDeck;
    const username = req.cookies.username;
    //make a fresh call to the database
    mongoFind(currentDeck, username, (result) => {
      const { currentScore } = req.query;
      const { totalPoints } = req.query;
      //get rid of description
      result.shift();
      //sort CORRECT data, and assign it as a property of each card.
      let sortedCorrect = correct.sort((a, b) => {
        return a.id - b.id;
      });
      result.forEach((element, i) => {
        element.correct = sortedCorrect[i].correct;
        element.userAnswer = sortedCorrect[i].userAnswer;
        if (element.correct === true) {
          totalScore++;
        }
      });
      //pass data to page
      res.locals.cards = result;
      //query params
      // res.locals.totalPoints = totalPoints;
      // res.locals.finalScore = currentScore;
      res.locals.finalScore = totalScore;
      res.locals.totalPoints = data[0].totalPoints;
      res.render("quiz");
    });
  }
});

//Question post, get rid of used question, log score, and display new score
router.post("/", (req, res) => {
  console.log(questionNumberPost + "post");
  console.log(req.body.questionNumber);
  if (!(req.body.questionNumber - 1 === questionNumberPost)) {
    console.log("cheater cheater pumpkin eater");
  } else {
    const totalPoints = req.body.totalPoints;
    let currentScore = parseInt(req.body.currentScore);
    let firstQuestion;
    data = JSON.parse(req.body.data);
    const cardNumber = data[req.body.id].cardNumber;
    //check if answer is correct and give score
    //& log id number and if answer was right or not for the results page
    req.body.correct.length > 1
      ? (firstQuestion = false)
      : (firstQuestion = true);
    if (
      data[req.body.id].answer.replace(/\s/g, "").toLowerCase() ==
      req.body.userAnswer.replace(/\s/g, "").toLowerCase()
    ) {
      console.log("correct");
      currentScore++;
      //log the id number of the card, if the answer was correct, and the users answer for the result page.
      firstQuestion
        ? (correct = [
            { id: cardNumber, correct: true, userAnswer: req.body.userAnswer },
          ])
        : correct.push({
            id: cardNumber,
            correct: true,
            userAnswer: req.body.userAnswer,
          });
    } else {
      console.log("wrong");
      firstQuestion
        ? (correct = [
            { id: cardNumber, correct: false, userAnswer: req.body.userAnswer },
          ])
        : correct.push({
            id: cardNumber,
            correct: false,
            userAnswer: req.body.userAnswer,
          });
    }
    // erase past card from data list
    data.splice(req.body.id, 1);

    questionNumberPost++;

    //show next card
    currentCard = Math.floor(Math.random() * (data.length - 1)) + 1;
    res.redirect(
      "/quiz/" +
        currentCard +
        "?currentScore=" +
        currentScore +
        "&totalPoints=" +
        totalPoints
    );
  }
});

module.exports = router;
