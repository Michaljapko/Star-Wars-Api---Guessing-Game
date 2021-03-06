const info = document.querySelector('.info');
const buttonBox = document.querySelector('.button-box');
const img = document.querySelector('.img');
const img2 = document.querySelector('.img2');
const img3 = document.querySelector('.img3');
const buttons = buttonBox.querySelectorAll('button');
const pointsDOM = document.querySelector('#points');
const addPointsDOM = document.querySelector('.addpoints');
const loadingDOM = document.querySelector('.loading');

let rightCharInfo = '';
let rightCharImg = '';
let score = 0;
let imgLoaded = 0;
let arrRandomNum = [1, 1, 1]; // Check this arr every time when making new num in order to not making same number.

function randomCharNum() {
	num = parseInt(Math.random() * (87 - 1) + 1);
	if (arrRandomNum.includes(num)) {
		arrRandomNum.shift();
		if (num === 87) {
			num--;
		} else {
			num++;
		}
		arrRandomNum.push(num);
	} else {
		arrRandomNum.shift();
		arrRandomNum.push(num);
	}
	return num;
}

async function assignButton() {
	const firstFakeChar = await getFakeCharName();
	const secondFakeChar = await getFakeCharName();
	if (firstFakeChar === secondFakeChar) {
		secondFakeChar = await getFakeCharName();
	}
	let arr = Object.values(buttons);
	arr = shuffle(arr);
	arr.forEach(function (button) {
		button.classList.remove('red');
	});
	arr[0].innerHTML = rightCharInfo;
	arr[0].previousElementSibling.src = rightCharImg;
	arr[1].innerHTML = firstFakeChar[0];
	arr[1].previousElementSibling.src = firstFakeChar[1];
	arr[2].innerHTML = secondFakeChar[0];
	arr[2].previousElementSibling.src = secondFakeChar[1];
}

async function getCharacter() {
	buttonBox.classList.add('hide');
	loadingDOM.classList.remove('hide');
	const resPeople = await fetch(`api/id/${randomCharNum()}.json`);
	const charInfo = await resPeople.json();
	rightCharInfo = charInfo.name;
	rightCharImg = charInfo.image;
	info.querySelector('.species').lastElementChild.innerHTML = `${charInfo.species}`;
	info.querySelector('.homeworld').lastElementChild.innerHTML = `${checkUnknow(charInfo.homeworld)}`;
	info.querySelector('.date').lastElementChild.innerHTML = `${dateEra(charInfo.born)} - ${dateEra(charInfo.died)}`;
	info.querySelector('.died').lastElementChild.innerHTML = `${checkUnknow(charInfo.diedLocation)}`;
	imgLoaded = 0;
	await assignButton();
	setTimeout(function () {
		addPointsDOM.classList.add('hide');
	}, 1000);
}

async function getFakeCharName() {
	const resPeople = await fetch(`api/id/${await randomCharNum()}.json`);
	const charInfo = await resPeople.json();
	const arr = [charInfo.name, charInfo.image];
	return arr;
}

function checkUnknow(data) {
	if (data == null) {
		return 'Unknow';
	}
	return data;
}
function dateEra(date) {
	if (date == null) return 'Unknow';
	date = date.toString();
	if (date.includes('-')) {
		date = date.replace('-', '');
		date += ' BBY';
	} else {
		date += ' ABY';
	}
	return date;
}

function shuffle(arr) {
	firstElement = arr.shift();
	arr.splice(parseInt(Math.random() * 3), 0, firstElement);
	return arr;
}

const check = (e) => {
	if (e.target.localName === 'button' && e.target.innerHTML !== rightCharInfo) {
		score = 0;
		pointsUpdate();
		e.target.classList.add('red');
	}
	if (e.target.innerHTML === rightCharInfo) {
		addPointsDOM.classList.remove('hide');
		score++;
		pointsUpdate();
		getCharacter();
	}
};

const pointsUpdate = () => {
	pointsDOM.firstElementChild.innerHTML = score;
};

const load = () => {
	imgLoaded++;
	if (imgLoaded === 3) {
		loadingDOM.classList.add('hide');
		buttonBox.classList.remove('hide');
	}
};

getCharacter();

buttonBox.addEventListener('click', check);
img.addEventListener('load', load);
img2.addEventListener('load', load);
img3.addEventListener('load', load);
