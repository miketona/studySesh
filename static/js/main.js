//Global variables, used for the quiz portion of the app.
let correctAnswer;
let currentAttempts = 3;
let hint;
let data;
//main function to handle all client side js that is not event driven
const main = function () {
  if (document.location.pathname == "/login") {
    document.getElementById("backToIndex").style.display = "none";
  }
  //If quiz is being taken, store and hide values from chrome developer window
  if (document.getElementById("answer")) {
    const answerElement = document.getElementById("answer");
    correctAnswer = answer.value;
    hint = document.getElementById("hint").value;
    answerElement.value = "hidden";
    document.getElementById("hint").value = "hidden";
    data = document.getElementById("data").value;
    document.getElementById("data").value = "hidden";
  }
  if (
    document.location.pathname == "/register" &&
    document.getElementById("footerParagraph")
  ) {
    document.getElementById("footerParagraph").display = "none";
  }
  //set onhover animation functions

  //call on page load functions
  setTimeout(() => {
    onloadAnimation();
  }, 200);
};
//onload animation functions
const onloadAnimation = function () {
  anime({
    targets: [".changeDeckButton", ".deleteButton"],
    translateY: [
      { value: 50, duration: 500 },
      { value: 0, duration: 800 },
    ],
    rotate: "2turn",
  });
  const title = document.querySelector("h1");
  title.style.color = "white";
  anime({
    targets: title,
    loop: false,
    translateY: [
      { value: 50, duration: 500 },
      { value: 0, duration: 800 },
    ],
    color: "black",
    rotate: "2turn",
    direction: "alternate",
    easing: "easeInOutSine",
    duration: 100,
  });

  //disable back button while taking quiz. Additional precautions taken on back end
  if (document.location.pathname.includes("/quiz")) {
    history.pushState(null, null, location.href);
    history.back();
    history.forward();
    window.onpopstate = function () {
      history.go(1);
    };
  }

  anime({
    targets: "path",
    strokeDashoffset: [anime.setDashoffset, 0],
    easing: "easeInOutSine",
    duration: 1500,
    delay: function (el, i) {
      return i * 250;
    },
    direction: "alternate",
    loop: false,
  });
};

//call main
main();

//Event driven functions

//validates submission for creating card and creating deck form
//& disables submit button
const submitted = function (myForm) {
  //validate form
  //do not allow for double submission to database
  myForm.submitButton.disabled = "true";
  //for input error submissions, allow for a second submit after 10 second
  setTimeout(() => {
    myForm.submitButton.disabled = "false";
  }, 10000);
  return true;
};

//handles quiz submissions, allows for three attempts
//&provides user with prompts when answer is incorrect
const quizAnswer = function (myForm) {
  myForm.submitButton.disabled = true;
  setTimeout(() => {
    myForm.submitButton.disabled = false;
  }, 1000);
  let message = document.getElementById("popUpMessage");
  correctAnswer = correctAnswer.replace(/\s/g, "").toLowerCase();
  //allow for three attempts, if wrong echo out to user that it is wrong and let them know how many attempts they have left
  while (currentAttempts !== 0) {
    currentAttempts--;
    console.log(currentAttempts);
    const usersAnswer = myForm.userAnswer.value
      .replace(/\s/g, "")
      .toLowerCase();
    if (usersAnswer !== correctAnswer) {
      if (currentAttempts === 0) {
        break;
      } else {
        message.innerHTML =
          "You got the answer wrong. You have " +
          currentAttempts +
          " attempts left.";
        if (hint) message.innerHTML += "<br> Hint: " + hint;

        return false;
      }
    } else {
      document.getElementById("data").value = data;
      return true;
    }
  }
  document.getElementById("data").value = data;
  return true;
};
//handles deleting flash-card deck submissions. Disables double click and warns user that deletion is permanent
const deleteDeck = function (clickedButton) {
  //disable double click
  let deleteButton = clickedButton;
  let parentNode = clickedButton.parentNode;
  deleteButton.disabled = true;
  //create message and yes/no buttons and display them
  let message = document.createElement("p");
  let yes = document.createElement("button");
  let no = document.createElement("button");
  yes.type = "submit";
  no.type = "button";
  no.innerHTML = "NO";
  yes.innerHTML = "YES";
  no.classList.add("noButton", "optionButton");
  yes.classList.add("yesButton", "optionButton");
  message.className = "errorMessage";
  message.innerHTML =
    "WARNING, this will permanently delete this object. Click YES to delete the object, or click NO to keep the object.";
  parentNode.appendChild(message);
  message.appendChild(no);
  message.appendChild(yes);
  //if no is clicked, then delete message and reset deleteButton
  no.onclick = () => {
    parentNode.removeChild(message);
    deleteButton.disabled = false;
  };
  //if changeDeck page, figure out what button was clicked and alter the action based on this. This will allow for me to use two separate post routes for one from.
  yes.onclick = () => {
    if (location.pathname == "/changeDeck") {
      clickedButton.parentNode.parentNode.action = "/deleteDeck";
    }
  };
};
