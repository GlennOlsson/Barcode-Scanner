

let sessions = [];

/**
 * A random integer between min (inc) and max (exc)
 */
function randomInt(min, max) {
	return Math.floor(Math.random() * (max - min) ) + min;
}

/**
 * Session ID is 3+3 alpha numerical uppercase
 */
export function generateSessionID() {
	let alphaNum = "ABCDEFGHIJKLMNOPQRSTUVWXYZ01234567890";

	let id = "";

	for(var i = 0; i < 3; i++) {
		let index = randomInt(0, alphaNum.length);
		let char = alphaNum[index];
		id += char;
	}

	id += "-";

	for(var i = 0; i < 3; i++) {
		let index = randomInt(0, alphaNum.length);
		let char = alphaNum[index];
		id += char;
	}
	
	return id;
}