let blackjackGame = {
    "you": {"scoreSpan": "#your-blackjack-result", "div": "#your-box", "score": 0},
    "dealer": {"scoreSpan": "#dealer-blackjack-result", "div": "#dealer-box", "score": 0},
    "cards": ["2", "3", "4", "5", "6", "7", "8", "9", "10", "K", "J", "Q", "A"],
    "cardsMap": {"2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, "8": 8, "9": 9, "10": 10, "K": 10, "J": 10, "Q": 10, "A": [1, 11]},
    "wins": 0,
    "loses": 0,
    "draws": 0,
    "isStand": false,
    "turnsOver": false,
    
};

const YOU = blackjackGame["you"];
const DEALER = blackjackGame["dealer"];

const HIT_SOUND = new Audio("static/sounds/swish.m4a");
const WIN_SOUND = new Audio("static/sounds/cash.mp3");
const LOSE_SOUND = new Audio("static/sounds/aww.mp3");
HIT_SOUND.volume = 0.2;
WIN_SOUND.volume = 0.1;
LOSE_SOUND.volume = 0.1;

document.querySelector("#blackjack-hit-btn").addEventListener("click", blackjackHit);
document.querySelector("#blackjack-stand-btn").addEventListener("click", blackjackStand);
document.querySelector("#blackjack-deal-btn").addEventListener("click", blackjackDeal);

function blackjackHit(){
    if(!blackjackGame.isStand){
        let card = randomCard();
        updateScore(card, YOU);
        showScore(YOU);
        showCard(YOU, card);
    }   
    console.log("blackjackGame.isStand = " + blackjackGame.isStand);
}

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function blackjackStand(){
    blackjackGame.isStand = true;
    if(!blackjackGame.turnsOver)
    {     
        while(DEALER.score <= 15)
        {          
            let card = randomCard();
            updateScore(card, DEALER);
            showScore(DEALER);
            showCard(DEALER, card);
            await sleep(600);
        }   
        blackjackGame.turnsOver = true;
        updateResultTable(); 
    }
    
    console.log("blackjackGame.turnsOver = " + blackjackGame.turnsOver);
}

function randomCard(){
    let randomIndex = Math.floor(Math.random() * blackjackGame.cards.length);
    return blackjackGame.cards[randomIndex];
}

function updateScore(card, activePlayer){
    if(card === "A" && activePlayer.score + blackjackGame.cardsMap[card][1] <= 21){
        return activePlayer.score += blackjackGame.cardsMap[card][1]; //+11
    }
    else if(card === "A"){
        return activePlayer.score += blackjackGame.cardsMap[card][0];//+1
    }  
    return activePlayer.score += blackjackGame.cardsMap[card];   
}

function showScore(activePlayer){
    if(activePlayer.score <= 21){
        document.querySelector(activePlayer.scoreSpan).textContent = activePlayer.score;
    }
    else{
        document.querySelector(activePlayer.scoreSpan).textContent = "Bust!";
        document.querySelector(activePlayer.scoreSpan).style.color = "red";
    }
    
}

function showCard(activePlayer, card){
    if(activePlayer.score <= 21){
        let cardImage = document.createElement("img");
        cardImage.src = `static/images/${card}.png`;
        document.querySelector(activePlayer["div"]).appendChild(cardImage);
        HIT_SOUND.play();
    }  
}

function blackjackDeal(){
    if(blackjackGame.turnsOver === true){
        let yourImages = document.querySelector("#your-box").querySelectorAll("img");
        let dealerImages = document.querySelector("#dealer-box").querySelectorAll("img");
        for(let i = 0; i < yourImages.length; i++){
            yourImages[i].remove();
        } 
        for(let i = 0; i < dealerImages.length; i++){
            dealerImages[i].remove();
        }   
        blackjackGame.isStand = false;
        blackjackGame.turnsOver = false;
        resetLetsPlay();
        clearScore(YOU);
        clearScore(DEALER);
        resetSpanColor(YOU);
        resetSpanColor(DEALER);
    }  
}

function clearScore(activePlayer){
    activePlayer.score = 0;
    document.querySelector(activePlayer.scoreSpan).textContent = activePlayer.score;
}

function resetSpanColor(activePlayer){
    document.querySelector(activePlayer.scoreSpan).style.color = "white";
}

function updateResultTable(){ 
    let message, messageColor;
    if(YOU.score > 21 && DEALER.score > 21){
        blackjackGame.draws++;
        document.querySelector("#draws").textContent = blackjackGame.draws;
        message = "You got a draw!";
        messageColor = "orange";
    }
    else if(YOU.score > 21){
        blackjackGame.loses++;
        document.querySelector("#loses").textContent = blackjackGame.loses;
        LOSE_SOUND.play();
        message = "You lost!";
        messageColor = "red";
    }
    else if(DEALER.score > 21 || YOU.score > DEALER.score){
        blackjackGame.wins++;
        document.querySelector("#wins").textContent = blackjackGame.wins;
        WIN_SOUND.play();
        message = "You won!";
        messageColor = "green";
    }
    else if(YOU.score < DEALER.score){
        blackjackGame.loses++;
        document.querySelector("#loses").textContent = blackjackGame.loses;
        LOSE_SOUND.play();
        message = "You lost!";
        messageColor = "red";
    }
    else{
        blackjackGame.draws++;
        document.querySelector("#draws").textContent = blackjackGame.draws;
        message = "You drew!";
        messageColor = "orange";
    }
    document.querySelector("#blackjack-result").textContent = message;
    document.querySelector("#blackjack-result").style.color = messageColor;
}

function resetLetsPlay(){
    document.querySelector("#blackjack-result").textContent = "Let's play";
    document.querySelector("#blackjack-result").style.color = "black";
}