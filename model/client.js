export default class Client {
	connectedOn = Date();
	client;

	constructor(client) {
		this.client = client
	}

	send(msg) {
		this.client.send(msg);
	}
}