
export default class Session {
	id;
	clients = []
	scanned = []

	addScanned(content) {
		this.scanned.push(content)
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