
let sessionID = undefined;

let scans = [];

/**
 * Called when sessionID might have changed i.e. must update page
 */
function reRender() {
	document.getElementById("without-session").style.display = sessionID === undefined ? "" : "none"
	document.getElementById("with-session").style.display = sessionID !== undefined ? "" : "none"

	document.getElementById("session-id-field").textContent = `Session: ${sessionID}`

	let scanList = document.getElementById("scan-list");
	
	// Empty scan list, re render each time (ugly)
	scanList.innerHTML = "";

	//Render scan list
	scans.forEach(scan => {
		let li = document.createElement("li");
		li.textContent = scan;
		li.key = scan + Date()
		scanList.appendChild(li);
	})

	renderQR();
}

function renderQR() {
	let content = sessionID;

	if(!content) {
		console.log("No content");
		return;
	}
	
	new QRCode("qrcode", "http://jindo.dev.naver.com/collie");
	console.log("Created QR code")
}

function createSession() {
	console.log("Create")
	fetch("http://localhost:3000/session/create", {
		method: "POST"
	})
		.then(resp => resp.text())
		.then(responseText => {
			sessionID = responseText
		})
		.then(() => reRender())
		.then(() => connectToSession())
		.catch(err => {
			console.log("Error", err)
		});
}

function joinSessionClicked() {
	let sessionInputElem = document.getElementById("join-session-input");
	let sessionIDInput = sessionInputElem.value;

	let joinButton = document.getElementById("join-session-button");
	joinButton.disabled = true;

	console.log("Session id", sessionIDInput)
	
	fetch("http://localhost:3000/session/" + sessionIDInput)
		.then(res => {
			if(res.status == 404) {
				throw Error(`No session with id '${sessionIDInput}'`);
			} else {
				sessionID = sessionIDInput;
				return res.json();
			}
		})
		.then(jsonResp => {
			scans = jsonResp.scanned;
		})
		.then(() => {
			reRender();
			connectToSession();
		})
		.catch(err => {
			let errorP = document.getElementById("join-session-error");
				errorP.textContent = err;
				joinButton.disabled = false;
		})
}

function connectToSession() {
	let socket = new WebSocket("ws://localhost:3000/session/connect");
	socket.onopen = () => {
		socket.send(JSON.stringify({
			type: "connect",
			session: sessionID
		}));
		console.log("Connected to ", sessionID)
	}

	socket.onmessage = (event) => {
		console.log("GOT", event.data);
		let data = JSON.parse(event.data);
		scans.push(data.scanned);
		reRender();
	}

}

window.onload = () => {
	console.log("loaded");
	reRender();
}