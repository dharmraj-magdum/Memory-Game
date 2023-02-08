const cards = document.querySelectorAll(".card");
const board = document.querySelector("#board");
const result = document.querySelector("#result");
const time = document.querySelector("#time");
const flips = document.querySelector("#flips");

//game variables

const cardCount = 8;
let matched = 0;
let flipCount = 0;
let cardOne;
let cardTwo;
let disableDeck = false;
//
var date;
var START;
var mytimer;
//

function flipCard({ target: clickedCard }) {
	//destructure event to its target and name that parameter clickedCard

	//check same card is not selected again and deck is available to click
	if (cardOne !== clickedCard && !disableDeck) {
		//display flip count
		flipCount += 1;
		flips.innerHTML = flipCount;
		//clickable then click it , so flip it
		clickedCard.classList.add("flip");
		if (!cardOne) {
			//if first is not set yet then set it
			cardOne = clickedCard;
			return;
		}
		//now assing clickedCard as second selected card
		cardTwo = clickedCard;
		//now as we clicked two card disable deck to click untill evaluation
		disableDeck = true;

		//get images names of selected card
		let cardOneImg = cardOne.querySelector(".back-view img").src,
			cardTwoImg = cardTwo.querySelector(".back-view img").src;
		//pass these names for evaluation
		matchCards(cardOneImg, cardTwoImg);
	}
}

function matchCards(img1, img2) {
	//check images are same or not
	if (img1 === img2) {
		//increse count
		matched++;
		//
		setTimeout(() => {
			//====add class for good ui
			cardOne.classList.add("disappear");
			cardTwo.classList.add("disappear");
			setTimeout(() => {
				//==========
				cardOne.removeEventListener("click", flipCard);
				cardTwo.removeEventListener("click", flipCard);
				//remove those ele from display
				cardOne.style.visibility = "hidden";
				cardTwo.style.visibility = "hidden";
				// cardOne.remove();
				// cardTwo.remove();
				cardOne = cardTwo = "";
				disableDeck = false;
			}, 300);
		}, 500);
		//if all matched game is finished
		if (matched == cardCount) {
			window.clearInterval(mytimer);
			setTimeout(() => {
				result.classList.add("display");
				board.classList.remove("display");
			}, 1200);
		}
		return;
	}

	//if not same then simply fip back both but first shake them say wrong to user
	setTimeout(() => {
		//add shake clas on selected card after 300milsec to user to see
		cardOne.classList.add("shake");
		cardTwo.classList.add("shake");
	}, 300);
	//flipping back will done after 1200milsec (also for user experience)
	//delay to user to memorize
	setTimeout(() => {
		cardOne.classList.remove("shake", "flip");
		cardTwo.classList.remove("shake", "flip");
		//set both selected cards to null;
		cardOne = cardTwo = null;
		//make disable to false for further game
		disableDeck = false;
	}, 1200);
}

//funtions simply suffle card in cards
function shuffleCard() {
	// reset
	date = new Date();
	START = date.getTime();
	showTime();
	matched = 0;
	flipCount = 0;
	disableDeck = false;
	cardOne = cardTwo = "";
	flips.innerHTML = flipCount;
	//
	let arr = [1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8];
	//sort array but decision factor is random
	arr.sort(() => (Math.random() > 0.5 ? 1 : -1));
	//so arr is get randomize
	cards.forEach((card, i) => {
		//reset
		card.classList.remove("flip");
		setTimeout(() => {
			card.classList.remove("disappear");
			card.style.visibility = "visible";
			//select its image tag
			let imgTag = card.querySelector(".back-view img");
			//and change to our arr
			imgTag.src = `images/img-${arr[i]}.png`;
			//add event listerner to that card
		}, 300);

		card.addEventListener("click", flipCard);
	});
}

// shuffleCard();
function refresh() {
	result.classList.remove("display");
	board.classList.add("display");
	//shuffle board
	shuffleCard();
	//display time
	mytimer = setInterval(showTime, 1000);
}
refresh();
//
function showTime() {
	date = new Date();
	let sec = Math.floor((date.getTime() - START) / 1000);
	time.innerHTML = sec + "sec";
}
//we can use grid position to remove matched card
//but when any row becomes empty below row move up
//its making over complication we can simply set card visibility to hidden when matched
// let startCol = (i % 4) + 1;
// startCol = startCol == 0 ? 4 : startCol;
// let startRow = Math.floor(i / 4);
// card.style.gridColumn = `${startCol}/span 1`;
// card.style.gridRow = `${startRow}/span 1`;
