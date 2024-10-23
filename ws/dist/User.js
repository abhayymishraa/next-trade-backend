"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const in_1 = require("./types/in");
const SubscriptionManager_1 = require("./SubscriptionManager");
class User {
    constructor(id, ws) {
        this.subscriptions = [];
        this.id = id;
        this.ws = ws;
        this.addListeners();
    }
    subscribe(subscription) {
        this.subscriptions.push(subscription);
    }
    unsubscribe(subscription) {
        this.subscriptions = this.subscriptions.filter(s => s !== subscription);
    }
    emit(message) {
        this.ws.send(JSON.stringify(message));
    }
    addListeners() {
        this.ws.on('message', (message) => {
            const parsedMessage = JSON.parse(message);
            console.log("Received message: ", parsedMessage);
            if (parsedMessage.method === in_1.SUBSCRIBE) {
                parsedMessage.params.forEach(s => SubscriptionManager_1.SubscriptionManager.getInstance().subscribe(this.id, s));
            }
            if (parsedMessage.method === in_1.UNSUBSCRIBE) {
                parsedMessage.params.forEach(s => SubscriptionManager_1.SubscriptionManager.getInstance().unsubscribe(this.id, parsedMessage.params[0]));
            }
        });
    }
}
exports.User = User;
