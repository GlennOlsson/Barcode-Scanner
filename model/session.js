import Scan from "./scan";

export default class Session {
	id;
	clients = []
	scanned = []

	itemScanned(content) {

		let scan = new Scan(content);

		this.scanned.push(scan);

		this.broadcast(JSON.stringify({
			scan
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
		});
	}
}