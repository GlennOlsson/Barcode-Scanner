import { addClientToSession, createSession, getSession, itemScanned } from './sessionManager.js'

import express from 'express'
import expressWs from 'express-ws'
import cors from 'cors'

const app = express()
const ws = expressWs(app)
const port = 3000

app.use(cors())

app.post("/session/create", function(req, res){
	console.log("Create session");
	let session = createSession();
	res.send(JSON.stringify(session));
});

app.get("/session/:id", function(req, res){
	let sessionId = req.params.id;
	console.log("Requesting session " + sessionId);
	let session = getSession(sessionId);
	if(!session) {
		res.status(404);
		res.send(JSON.stringify({error: "No session with id " + sessionId}));
	} else {
		res.send(JSON.stringify(session))
	}
});

app.ws("/session/connect", function(client, req) {
	client.on("message", function(msg) {
		let jsonMsg;
		try {
			jsonMsg = JSON.parse(msg);
		} catch (e) {
			console.log("ERR", e)

			return
		}

		let type = jsonMsg["type"]

		switch(type) {
			case "scan":
				var sessionID = jsonMsg["session"];
				var scannedValue = jsonMsg["content"];
				console.log("Scanned in ", sessionID, ":", scannedValue);
				itemScanned(sessionID, scannedValue);
				break;
			case "connect":
				var sessionID = jsonMsg["session"];
				console.log("Connect to ", sessionID);
				addClientToSession(sessionID, client);
				break;
			default:
				console.log("Type not supported: ", type);
				client.send("Type not supported: " + type);
		}
	});
});

app.listen(port, () => {
	console.log(`Server listening at http://localhost:${port}`);
});