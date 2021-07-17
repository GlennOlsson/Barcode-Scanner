
let sessionID = undefined;

let scans = [];

function createScanElement(scanValue, index) {
	let li = document.createElement("li");

	let text = document.createElement("p");

	li.appendChild(text);

	text.textContent = scanValue;

	let copyButton = document.createElement("button");
	copyButton.onclick = () => {
		navigator.clipboard.writeText(scanValue);
	}
	copyButton.textContent = "Copy";
	copyButton.style.float = "right";

	li.appendChild(copyButton);

	li.key = scanValue + Date(); //Unique key

	// Alternating colors for rows
	let alpha = index % 2 === 0 ? 0.3 : 0.7;
	let backgroundColor = `rgba(100, 100, 100, ${alpha})`;
	li.style.backgroundColor = backgroundColor;

	return li;
}

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
	scans.forEach((scan, index) => {
		let scanElement = createScanElement(scan, index);
		scanList.appendChild(scanElement);
	})

	renderQR();
}

function renderQR() {
	let content = sessionID;

	if(!content) {
		console.log("No content");
		return;
	}
	
	new QRCode("qrcode", sessionID);
}

function createSession() {
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
	let sessionIDInputRaw = sessionInputElem.value;

	let sessionIDInput = sessionIDInputRaw.toUpperCase().trim();

	let joinButton = document.getElementById("join-session-button");
	joinButton.disabled = true;

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
		let data = JSON.parse(event.data);
		scans.push(data.scanned);
		navigator.clipboard.writeText(data.scanned);
		reRender();
	}

}

window.onload = () => {
	reRender();

	// navigator.permissions.query({name: "clipboard-write"}).then(result => {
	// 	if (result.state == "granted" || result.state == "prompt") {
	// 			console.log("User accepts clipboard mods");
	// 	} else {
	// 		console.log("User does not agree to clipboard mods");
	// 	}
	// });
}