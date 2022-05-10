let deckId
const cardsContainer = document.getElementById("cards");
const newDeckBtn = document.getElementById("new-deck");
const drawCardBtn = document.getElementById("draw-cards");
let header = document.querySelector(".header");
let remainingCards = document.querySelector(".remaining-cards");
let displayComputerScore = document.querySelector(".display-computer-score");
let displayPlayerScore = document.querySelector(".display-player-score");
let computerScore = 0;
let playerScore = 0;

drawCardBtn.disabled = true;

function handleClick() {
    fetch("https://deckofcardsapi.com/api/deck/new/shuffle")
        .then(res => res.json())
        .then(data => {
            deckId = data.deck_id
            remainingCards.textContent = `Cards remaining: ${data.remaining}`
            header.textContent = "Game of War";
            header.style.color = "#fff";
            drawCardBtn.disabled = false;
            drawCardBtn.style.color = "black";
            drawCardBtn.style.background = "yellow";
            playerScore = 0;
            computerScore = 0;
            displayComputerScore.textContent = `Computer Score: ${computerScore}`
            displayPlayerScore.textContent = `Player Score: ${playerScore}`
        })
}

newDeckBtn.addEventListener("click", handleClick)

drawCardBtn.addEventListener("click", () => {
    fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`)
        .then(res => res.json())
        .then(data => {
            count = data.remaining;
            if(data.remaining === 0) {
                drawCardBtn.disabled = true;
                drawCardBtn.style.background = "red";
                drawCardBtn.style.color = "#fff";
                if(computerScore > playerScore){
                    header.textContent = "THE COMPUTER WON THE GAME!!!"
                    header.style.color = "red";
                } else if (computerScore < playerScore){
                    header.textContent = "YOU WON THE GAME!!!"
                    header.style.color = "red";
                } else {
                    header.textContent = "IT'S A TIE!!!"
                    header.style.color = "red";
                }

            }

            remainingCards.textContent = `Cards remaining: ${data.remaining}`

            const computerCard = data.cards[0];
            const playerCard = data.cards[1];

            cardsContainer.children[0].innerHTML = `
                <img src=${computerCard.image} class="card" />
            `
            cardsContainer.children[1].innerHTML = `
                <img src=${playerCard.image} class="card" />
            `
            let winnerText = determineCardWinner(computerCard, playerCard);
            header.textContent = winnerText;   
        })
})


function determineCardWinner(card1, card2) {
    const valueOptions = ["2", "3", "4", "5", "6", "7", "8", "9", 
    "10", "JACK", "QUEEN", "KING", "ACE"]
    const card1ValueIndex = valueOptions.indexOf(card1.value)
    const card2ValueIndex = valueOptions.indexOf(card2.value)
    
    if (card1ValueIndex > card2ValueIndex) {
        computerScore++;
        displayComputerScore.textContent = `Computer Score: ${computerScore}`;
        return "Computer wins!";
    } else if (card1ValueIndex < card2ValueIndex) {
        playerScore++
        displayPlayerScore.textContent = `Player Score: ${playerScore}`;
        return "You win!";
    } else {
        return "War!";
    }
}

