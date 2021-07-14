
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
	
	scanList.innerHTML = "";

	scans.forEach(scan => {
		let li = document.createElement("li");
		li.textContent = scan;
		li.key = scan + Date()
		scanList.appendChild(li);
	})
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