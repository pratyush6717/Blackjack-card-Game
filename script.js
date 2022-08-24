let blackjackGame = {
  player: {
    scoreSpan: "#player-blackjack-result",
    div: "#player-box",
    score: 0
  },
  dealer: {
    scoreSpan: "#dealer-blackjack-result",
    div: "#dealer-box",
    score: 0
  },
  cards: ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"],
  cardsMaps: {
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 9,
    "10": 10,
    K: 10,
    Q: 10,
    J: 10,
    A: [1, 11]
  },
  wins: 0,
  losses: 0,
  draws: 0,
  isStand: false,
  turnOver: false
};

const PLAYER = blackjackGame["player"];
const DEALER = blackjackGame["dealer"];

const hitSound = new Audio("sounds/swish.m4a");

const winSound = new Audio("sounds/cash.mp3");

const loseSound = new Audio("sounds/aww.mp3");

document
  .querySelector("#blackjack-hit-button")
  .addEventListener("click", blackjackHit);

document
  .querySelector("#blackjack-stand-button")
  .addEventListener("click", dealerLogic);

document
  .querySelector("#blackjack-deal-button")
  .addEventListener("click", blackjackDeal);

function blackjackHit() {
  if (blackjackGame["isStand"] === false) {
    let card = randomCard();
    // console.log(card);
    showCard(card, PLAYER);
    updateScore(card, PLAYER);
    showScore(PLAYER);
    // console.log(PLAYER["score"]);
  }
}

function randomCard() {
  let randomIndex = Math.floor(Math.random() * 13);
  return blackjackGame["cards"][randomIndex];
}

function showCard(card, activePlayer) {
  if (activePlayer["score"] <= 21) {
    let cardImage = document.createElement("img");
    cardImage.src = `images/${card}.png`;
    document.querySelector(activePlayer["div"]).appendChild(cardImage);
    hitSound.play();
  }
}

function blackjackDeal() {
  if (blackjackGame["turnOver"] === true) {
    // let winner = computeWinner();
    // showResult(winner);

    // showResult(computeWinner());
    // computeWinner();

    blackjackGame["isStand"] = false;

    let playerImages = document
      .querySelector("#player-box")
      .querySelectorAll("img");

    let dealerImages = document
      .querySelector("#dealer-box")
      .querySelectorAll("img");

    for (i = 0; i < playerImages.length; i++) {
      playerImages[i].remove();
    }

    for (i = 0; i < dealerImages.length; i++) {
      dealerImages[i].remove();
    }

    PLAYER["score"] = 0;
    DEALER["score"] = 0;

    document.querySelector("#player-blackjack-result").textContent = 0;
    document.querySelector("#dealer-blackjack-result").textContent = 0;

    document.querySelector("#player-blackjack-result").style.color = "white";
    document.querySelector("#dealer-blackjack-result").style.color = "white";

    document.querySelector("#blackjack-result").textContent = "Let's play";
    document.querySelector("#blackjack-result").style.color = "black";

    blackjackGame["turnOver"] = true;
  }
}

function updateScore(card, activePlayer) {
  if (card === "A") {
    // If adding 11 keeps me below 21, add 11. Else, add 1
    if (activePlayer["score"] + blackjackGame["cardsMaps"][card][1] <= 21) {
      activePlayer["score"] += blackjackGame["cardsMaps"][card][1];
    } else {
      activePlayer["score"] += blackjackGame["cardsMaps"][card][0];
    }
  } else {
    activePlayer["score"] += blackjackGame["cardsMaps"][card];
  }
}

function showScore(activePlayer) {
  if (activePlayer["score"] > 21) {
    document.querySelector(activePlayer["scoreSpan"]).textContent = "BUST!";

    document.querySelector(activePlayer["scoreSpan"]).style.color = "red";
  } else {
    document.querySelector(activePlayer["scoreSpan"]).textContent =
      activePlayer["score"];
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function dealerLogic() {
  blackjackGame["isStand"] = true;

  while (DEALER["score"] < 16 && blackjackGame["isStand"] === true) {
    let card = randomCard();
    showCard(card, DEALER);
    updateScore(card, DEALER);
    showScore(DEALER);
    await sleep(850);
  }

  blackjackGame["turnOver"] = true;
  let winner = computeWinner();
  showResult(winner);

  // if (DEALER["score"] > 15) {
  //   blackjackGame["turnOver"] = true;
  //   let winner = computeWinner();
  //   showResult(winner);
  //   console.log(blackjackGame["turnOver"]);
  // }
}

// calcuted the winner and return who just won
// updates the wins, losses and draws
function computeWinner() {
  let winner;

  if (PLAYER["score"] <= 21) {
    // Condition: Higher score than dealer or when dealer busts but yoy have 21 or under
    if (PLAYER["score"] > DEALER["score"] || DEALER["score"] > 21) {
      // console.log("You won!");
      blackjackGame["wins"]++;
      winner = PLAYER;
    } else if (PLAYER["score"] < DEALER["score"]) {
      // console.log("You lost!");
      blackjackGame["losses"]++;
      winner = DEALER;
    } else if (PLAYER["score"] === DEALER["score"]) {
      // console.log("Draw!");
      blackjackGame["draws"]++;
    }

    // Condition: When user busts but dealer doesn't
  } else if (PLAYER["score"] > 21 && DEALER["score"] <= 21) {
    // console.log("You lost!");
    blackjackGame["losses"]++;
    winner = DEALER;
    // Condition: When you and the dealer busts
  } else if (PLAYER["score"] > 21 && DEALER["score"] > 21) {
    // console.log("Draw!");
    blackjackGame["draws"]++;
  }
  // console.log("winner is ", winner);
  return winner;
}

function showResult(winner) {
  let message, messageColor;

  if (blackjackGame["turnOver"] === true) {
    if (winner === PLAYER) {
      document.querySelector("#wins").textContent = blackjackGame["wins"];
      message = "You won!";
      messageColor = "green";
      winSound.play();
    } else if (winner === DEALER) {
      document.querySelector("#losses").textContent = blackjackGame["losses"];
      message = "You lost!";
      messageColor = "red";
      loseSound.play();
    } else {
      document.querySelector("#draws").textContent = blackjackGame["draws"];
      message = "Draw!";
      messageColor = "black";
    }

    document.querySelector("#blackjack-result").textContent = message;
    document.querySelector("#blackjack-result").style.color = messageColor;
  }
}