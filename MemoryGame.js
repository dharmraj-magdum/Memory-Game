const start_menu = document.querySelector("#start_menu");
const selected_text = document.getElementById("selected_text");
const stat = document.querySelector("#stat");
const board = document.querySelector("#board");
const result = document.querySelector("#result");
const time = document.querySelector("#time");
const flips = document.querySelector("#flips");

//game variables
var DIFFICULTY = "normal";
var cardPairCount = 8;
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

function generateBoard() {
	switch (DIFFICULTY) {
		case "easy":
			cardPairCount = 2;
			break;
		case "normal":
			cardPairCount = 8;
			break;
		case "hard":
			cardPairCount = 16;
			break;
		default:
			cardPairCount = 8;
			break;
	}
	board.innerHTML = "";
	board.style = `--colm:${cardPairCount > 2 ? cardPairCount / 2 : 2}`;
	for (let i = 0; i < cardPairCount * 2; i++) {
		board.innerHTML += ` <div class="card flip disappear" data-number="1" style="--number:1">
		        <div class="view front-view">
		            <img src="images/bg2.svg" alt="icon">
					</div>
					<div class="view back-view">
		            <img src="images/quetionmark.svg" alt="icon">
		        </div>
		    </div>`;
	}
}

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
		if (matched == cardPairCount) {
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

	//IMP task is to place each image even times according to total cards
	//we have 8 diff cards
	//case we have to make only 2 pairs choose any two img
	//case we have to make 8 pairs thats easy put 1 img per cardpair
	//but for 16 we have to put 1 img per 2 cardpair

	let arr = [];
	if (cardPairCount === 2) {
		let idx1 = Math.floor(Math.random() * 9);
		idx1 = idx1 == 0 ? 1 : idx1;
		let idx2 = Math.floor(Math.random() * 8) + 1;
		while (idx1 === idx2) {
			idx2 = Math.floor(Math.random() * 9);
		}
		arr = [idx1, idx1, idx2, idx2];
	} else if (cardPairCount === 8) {
		let imageRepetition = cardPairCount / 8;
		// console.log(imageRepetition);
		//saying one pair of image should now occure 1 times
		for (let index = 1; index <= 8; index++) {
			for (let rep = 0; rep < imageRepetition * 2; rep++) {
				arr.push(index);
			}
		}
	} else if (cardPairCount === 16) {
		let imageRepetition = cardPairCount / 8;
		//saying one pair of image should now occure 2 times
		for (let index = 1; index <= 8; index++) {
			for (let rep = 0; rep < imageRepetition * 2; rep++) {
				arr.push(index);
			}
		}
	}

	//sort array but decision factor is random
	//so arr is get randomize
	arr.sort(() => (Math.random() > 0.5 ? 1 : -1));

	// console.log(arr);

	const cards = document.querySelectorAll(".card");

	//card i moves from 0 to cardCount*2
	//and our array have values from (1 to cardCount)*N times actual imges we selected
	//so arr[i] gives us randome arrangeged but valid N img count
	cards.forEach((card, i) => {
		card.classList.remove("disappear");
		setTimeout(() => {
			card.classList.remove("flip");
			card.style.visibility = "visible";
			//select its image tag
			setTimeout(() => {
				let imgTag = card.querySelector(".back-view img");
				imgTag.src = `images/img-${arr[i]}.png`;
			}, 400);
			//and change to our arr
		}, 300);
		//add event listerner to that card
		card.addEventListener("click", flipCard);
	});
}

function showMenu() {
	//reset
	stat.classList.remove("display");
	board.classList.remove("display");
	result.classList.remove("display");
	//only show start menu
	start_menu.classList.add("display");
}
showMenu();
function startGame() {
	//generateBoard();
	//start game
	reStart();
}
function reStart() {
	//remove prev used
	result.classList.remove("display");
	start_menu.classList.remove("display");
	//Add display to all actual game elements
	board.classList.add("display");
	stat.classList.add("display");
	//
	generateBoard();
	//shuffle board
	shuffleCard();
	//display time
	mytimer = setInterval(showTime, 1000);
}
//
function showTime() {
	date = new Date();
	let sec = Math.floor((date.getTime() - START) / 1000);
	time.innerHTML = sec + "sec";
}

///for-----custom select menu
const selected_field = document.getElementById("selected_field");
const arrowIcon = document.getElementById("arrowIcon");
const list = document.getElementById("list");
const options = document.getElementsByClassName("option");
for (option of options) {
	option.onclick = function () {
		selected_text.innerText = this.textContent;
		DIFFICULTY = this.dataset.value;
		// console.log(DIFFICULTY);
		list.classList.toggle("close");
		arrowIcon.classList.toggle("rotate");
	};
}
selected_field.onclick = function () {
	list.classList.toggle("close");
	arrowIcon.classList.toggle("rotate");
};
//we can use grid position to remove matched card
//but when any row becomes empty below row move up
//its making over complication we can simply set card visibility to hidden when matched
// let startCol = (i % 4) + 1;
// startCol = startCol == 0 ? 4 : startCol;
// let startRow = Math.floor(i / 4);
// card.style.gridColumn = `${startCol}/span 1`;
// card.style.gridRow = `${startRow}/span 1`;
