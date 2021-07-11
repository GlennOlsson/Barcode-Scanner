import {generateSessionID} from './sessionManager.js'

import express from 'express'
const app = express()
const port = 3000

app.post("/session/create", function(req, res){
	let sessionId = generateSessionID();
	res.send(sessionId);
})

app.get("/session/:id", function(req, res){
	let sessionId = req.id;
	console.log("Requesting session " + sessionId);
});

app.listen(port, () => {
	console.log(`Server listening at http://localhost:${port}`);
})