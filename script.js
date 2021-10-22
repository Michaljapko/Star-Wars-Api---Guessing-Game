const info = document.querySelector('.info');
const buttonBox = document.querySelector('.button-box');
let buttons = buttonBox.querySelectorAll('button');

let rightCharInfo = '';

async function randomCharNum() {
	const res = await fetch(`https://swapi.dev/api/people/`);
	const data = await res.json();
	return parseInt(Math.random() * data.count);
}

async function assignButton() {
	let arr = Object.values(buttons);
	arr = shuffle(arr);
	arr[0].innerHTML = rightCharInfo;
	arr[1].innerHTML = await getFakeCharName();
	arr[2].innerHTML = await getFakeCharName();
}

async function getCharacter() {
	const resPeople = await fetch(`https://swapi.dev/api/people/${await randomCharNum()}`);
	const charInfo = await resPeople.json();
	rightCharInfo = charInfo.name;
	info.querySelector('.species').innerHTML = await getPropetyName(charInfo.species);
	info.querySelector('.height').innerHTML = charInfo.height;
	info.querySelector('.skin').innerHTML = charInfo.skin_color;
	info.querySelector('.year').innerHTML = charInfo.birth_year;
	info.querySelector('.homeworld').innerHTML = await getPropetyName(charInfo.homeworld);
	info.querySelector('.starships').innerHTML = await getPropetyName(charInfo.starships);
	info.querySelector('.films').innerHTML = await getPropetyName(charInfo.films, 'films');
	await assignButton();
}

async function getFakeCharName() {
	const resPeople = await fetch(`https://swapi.dev/api/people/${await randomCharNum()}`);
	const charInfo = await resPeople.json();
	return charInfo.name;
}

async function getPropetyName(url, dataType) {
	if (Array.isArray(url)) {
		const arr = [];
		for (const link of url) {
			const res = await fetch(link);
			const data = await res.json();
			dataType === 'films' ? arr.push(data.title) : arr.push(data.name);
		}
		return arr;
	} else {
		const res = await fetch(url);
		const data = await res.json();
		return data.name;
	}
}

function shuffle(arr) {
	firstElement = arr.shift();
	arr.splice(parseInt(Math.random() * 3), 0, firstElement);
	return arr;
}

const check = (e) => {
	if (e.target.innerHTML === rightCharInfo) {
		getCharacter()
	}
};

buttonBox.addEventListener('click', check);
