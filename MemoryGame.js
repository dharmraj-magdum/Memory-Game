const start_menu = document.querySelector("#start_menu");
const difficulty = document.getElementById("difficulty");
const theme = document.getElementById("theme");
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
//theme
var THEME = "fruits/fruit";
//menu var no reletion to project
var anyOpen = false;
// var theme = "crystals/img";
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
			cardPairCount = 15;
			break;
		default:
			cardPairCount = 8;
			// console.log("bydefalut");
			break;
	}
	board.innerHTML = "";
	let gridcolm = 4;
	gridcolm = cardPairCount == 2 ? 2 : cardPairCount == 8 ? 4 : 5;
	board.style = `--colm:${gridcolm}`;
	for (let i = 0; i < cardPairCount * 2; i++) {
		board.innerHTML += ` <div class="card flip disappear" data-number="1" style="--number:1">
		        <div class="view front-view">
		            <img src="images/bg2.svg" alt="icon">
					</div>
					<div class="view back-view">
		            <img src="images/quetionmark.png" alt="icon">
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
		}, 800);
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
	} else if (cardPairCount === 15) {
		let imageRepetition = 2;
		//saying one pair of image should now occure 2 times
		let totalPicked = 0;
		for (let index = 1; index <= 8; index++) {
			for (
				let rep = 0;
				rep < imageRepetition * 2 && totalPicked < cardPairCount * 2;
				rep++
			) {
				totalPicked++;
				arr.push(index);
			}
		}
	} else {
		cardPairCount = 8;
		let imageRepetition = cardPairCount / 8;
		// console.log(imageRepetition);
		//saying one pair of image should now occure 1 times
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
				imgTag.src = `images/${THEME}-${arr[i]}.png`;
			}, 400);
			//and change to our arr
		}, 400);
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
	DIFFICULTY = difficulty[difficulty.selectedIndex].value;
	console.log(DIFFICULTY);
	THEME = theme[theme.selectedIndex].value;
	console.log(THEME);
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

/////////////////////////////////////
//W3 custom menu , this becomes more complicated as every custom menu configured All in one time
var i, j, l, a, b, c;
/* Look for any elements with the class "custom-select": */
var menu_list = document.getElementsByClassName("custom-select");
var numberOfmenus = menu_list.length;
//do for each menu in our HTML
for (i = 0; i < numberOfmenus; i++) {
	var original_select = menu_list[i].getElementsByTagName("select")[0];
	var numberOfItems = original_select.length;
	// For each menu, create a new DIV that will act as the selected item
	// (to show what is currently selected)
	var show_selected = document.createElement("DIV");
	show_selected.setAttribute("class", "select-selected");
	//now put selected value in that div
	//by default it first value in options ie 0 (selectedIndex) in option
	show_selected.innerHTML =
		original_select.options[original_select.selectedIndex].innerHTML;
	//now put that in menu
	menu_list[i].appendChild(show_selected);
	/* For each menu (options), create a new DIV that will contain the option list: */
	//container inside menu who holds all items
	var optionsContainer = document.createElement("DIV");
	optionsContainer.setAttribute("class", "select-items select-hide");
	// For each option in the ORIGINAL select element,
	for (j = 1; j < numberOfItems; j++) {
		//	create a new DIV that will act as an option item: */
		var optionDiv = document.createElement("DIV");
		//put text in our new Duplicate option from ORIGINAL option
		optionDiv.innerHTML = original_select.options[j].innerHTML;
		//add listener fr click on our new option
		optionDiv.addEventListener("click", funForOpt);
		//now after comleting prep of option , add it to container
		optionsContainer.appendChild(optionDiv);
	}
	//now optionsContainer is filled with its options
	//simple put it in menu
	menu_list[i].appendChild(optionsContainer);

	//attach listener to showcase text
	//which onclick open menu and close
	show_selected.addEventListener("click", function (e) {
		//just for outside click ease to repeted closin on anywhere clicking
		anyOpen = true;
		// When the select box is clicked, close any other select boxes,
		//and open/close the current select box
		e.stopPropagation();
		//close menus which might be open
		closeAllSelect(this);
		//toggle hide class to open or close menu
		//it actually hide optionContainer and that we want
		this.nextSibling.classList.toggle("select-hide");
		//just for ui arrow
		this.classList.toggle("select-arrow-active");
	});
}
function funForOpt() {
	//When an item is clicked, update the ORIGINAL select box,
	//  and the selected item: */
	var original_select =
		this.parentNode.parentNode.getElementsByTagName("select")[0];
	var totalItems = original_select.length;
	//parent is optioncontainer its prevsibling is show_selected(showcase) div
	var show_selected = this.parentNode.previousSibling;
	for (let i = 0; i < totalItems; i++) {
		//for each ORIGINAL option
		//if innerHtml matched ,set that ori-option as selected
		if (original_select.options[i].innerHTML == this.innerHTML) {
			//set selected as mathed index
			original_select.selectedIndex = i;
			//simply put showcase with that text
			show_selected.innerHTML = this.innerHTML;
			//this is reset remove "same-as-selected" on all other our duplicate optoinsDivs
			//W3 do this -->
			// y = this.parentNode.getElementsByClassName("same-as-selected");
			// yl = y.length;
			// for (k = 0; k < yl; k++) {
			// 	y[k].removeAttribute("class");
			// }
			//my-->
			var prevSelectedDiv =
				this.parentNode.getElementsByClassName("same-as-selected")[0];
			if (prevSelectedDiv) {
				// console.log(prevSelectedDiv);
				prevSelectedDiv.removeAttribute("class");
			}
			//now only put classname it on current optionDiv
			this.setAttribute("class", "same-as-selected");
			//as matched with ori-option process done break;
			break;
		}
	}
	//memic as selcted but actually , we mannually click on show_selected
	//which open/close on toggle (here it closes)
	show_selected.click();
}
function closeAllSelect(elmnt) {
	//A function that will close all select boxes in the document,
	//except the current select box.
	var activeIdx = [];
	//get all containes
	var N_optionsContainer = document.getElementsByClassName("select-items");
	var containerCount = N_optionsContainer.length;
	var N_show_case = document.getElementsByClassName("select-selected");
	//get all show_case divs
	var showCaseCount = N_show_case.length;
	for (let i = 0; i < showCaseCount; i++) {
		if (elmnt == N_show_case[i]) {
			//match to this push in array
			// console.log("matched-", i);
			//this is added only once but its imp
			activeIdx.push(i);
		} else {
			//remove for arrow ui
			N_show_case[i].classList.remove("select-arrow-active");
		}
	}
	//here hide all optionscontainers(menu)
	//this is only helpfull if you click outside
	for (let i = 0; i < containerCount; i++) {
		//hide all other
		//check the curr ele(ie current active clicked container)
		//here diff approch first occur is zero which is false
		//but all other values gives -1 which is true
		///so add hide to all expect curr
		if (activeIdx.indexOf(i)) {
			// console.log("activeIdx.indexOf(i)", activeIdx.indexOf(i), "i", i);
			N_optionsContainer[i].classList.add("select-hide");
		}
	}
	//the cur ele is hiddded later in its onclick function
	//this becuase outside click close feature and click again on show_case
	//if we directly set all hide on for outside
	//then if click open ele(show_case) again to close it
	//closeAll add hide and ,toggle inside clickfun() get disturbed
	///as add hide here then toggle there back to remove hide
	//causing always open ele
	//IMM-> in-short all just to click back on show_case to close menu
}

/* If the user clicks anywhere outside the select box,
then close all select boxes: */
document.addEventListener("click", () => {
	// console.log(anyOpen);
	if (anyOpen == true) {
		anyOpen = false;
		closeAllSelect();
	}
});
