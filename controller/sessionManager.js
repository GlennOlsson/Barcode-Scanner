import Session from "../model/session.js"
import Client from "../model/client.js"

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
function generateSessionID() {
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

/**
 * Creates a session and returns the Session object
 */
export function createSession() {
	let session = new Session();
	session.id = generateSessionID();

	sessions.push(session)

	console.log("There are now " + sessions.length + " sessions")

	return session
}

export function addClientToSession(sessionID, wsClient) {
	let client = new Client(wsClient);

	let session = sessions.find(s => s.id === sessionID);
	if(!session) {
		console.log("Session does not exist", sessionID);
		return;
	}

	session.addClient(client)
}

export function itemScanned(sessionID, scannedValue) {
	let session = sessions.find(s => s.id === sessionID);
	if(!session) {
		console.log("Session does not exist", sessionID);
		return;
	}

	session.broadcast(JSON.stringify({
		"scanned": scannedValue
	}));

}