
export default class Session {
	id;
	clients = []
	scanned = []

	itemScanned(content) {
		this.scanned.push(content)

		this.broadcast(JSON.stringify({
			"scanned": content
		}));
	}

	addClient(client) {
		this.clients.push(client);
	}

	removeClient(client) {
		this.clients = this.clients.filter(c => c !== client);
	}

	broadcast(msg) {
		this.clients.forEach(client => {
			client.send(msg);
		})
	}
}