# Barcode scanner
Server and web for barcode scanner app

# API
## websocket
Connect at `/session/connect`
### Sent from clients
**Connect to session**
```json
{
	"type": "connect",
	"session": "SESSION-ID"
}
```
Subscribes the client to all scans in session.

**Scanned item**
```json
{
	"type": "scan",
	"session": "SESSION-ID",
	"content": "SCAN-CONTENT"
}
```
Broadcasts scanned content to all clients connected to session. You don't have to be connected to the session to send a scan.

### Sent from server
**Scan**
```json
{
	"scan": "SCAN-CONTENT"
}
```
Broadcasted scan content from a reader.

## HTTP
### Create session
`POST /session/create`

Creates a session. No body is needed.
#### Return body
Is a json representation of the `Session` object
```json 
{
	"id": "SESSION-ID",
	"clients": [
		{
			"connectedOn": "CONNECT-DATE",
			"client": "WS-CLIENT"
		}
	],
	"scanned": [
		{
			"value": "SCAN-VALUE",
			"date": "SCAN-DATE"
		}
	]
}
```
### Get session
`GET session/:id`

Gets the session.
#### Return body
Is a json representation of the `Session` object
```json 
{
	"id": "SESSION-ID",
	"clients": [
		{
			"connectedOn": "CONNECT-DATE",
			"client": "WS-CLIENT"
		}
	],
	"scanned": [
		{
			"value": "SCAN-VALUE",
			"date": "SCAN-DATE"
		}
	]
}
```

#### 404 error
Means that the session does not exist
