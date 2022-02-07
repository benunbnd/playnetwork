/*



{
    name: 'fire',
    scope: {
        type: 'user',
        id: 123
    },
    from: {
        type: 'player',
        id: 123
    }
    data: ...
}

// room send
room.send(name, data)

{
    name: 'fire',
    scope: {
        type: 'room',
        id: 123
    },
    from: {
        type: 'user',
        id: 124
    }
    data: ...
}


let user = pn.users.get(from.id);
user.players.

// user send
user.send(name, data)

{
    name: 'fire',
    scope: {
        type: 'user',
        id: 123
    },
    from: {
        type: 'user',
        id: 124
    }
    data: ...
}

*/

class PlayCanvasNetwork extends pc.EventHandler {
    constructor() {
        super();

        this.ups = 30;
        this.lastCallbackId = 0;
        this.callbacks = new Map();
    }

    initialize() {
        this.user = new User();
        this.rooms = new Rooms();
        this.levels = new Levels();
        this.players = new Map();
        this.templates = new Templates();

        this.on('_self', (data) => {
            pn.user.setData(data.user);
        });
    }

    connect() {
        this.socket = new WebSocket('ws://localhost:8080');

        this.socket.onmessage = (e) => {
            const msg = JSON.parse(e.data);

            if (msg.data?.err) {
                console.error(msg.data.err);
                return;
            }

            if (msg.callbackId >= 0) {
                const callback = this.callbacks.get(msg.callbackId);

                if (!callback) {
                    console.warn(`No callback with id - ${msg.callbackId}`);
                    return;
                }

                callback(msg.data);
                this.callbacks.delete(msg.callbackId);
            }

            if (msg.roomId) {
                const room = this.rooms.get(msg.roomId);
                if (room) {
                    room.fire(msg.name, msg.data);
                }
            }

            this.fire(msg.name, msg.data, msg.roomId);
        };

        this.socket.onopen = () => console.log('connect');
        this.socket.onclose = () => console.log('disconnect');
        this.socket.onerror = console.error;
    }

    send(name, data, callback) {
        this._send(name, data, null, callback);
    }

    _send(name, data, roomId, callback) {
        const msg = {
            name,
            data,
            roomId
        };

        if (callback) {
            msg.callbackId = this.lastCallbackId;
            this.callbacks.set(this.lastCallbackId, callback);
            this.lastCallbackId++;
        }

        this.socket.send(JSON.stringify(msg));
    }
}

window.pn = new PlayCanvasNetwork();
pn.initialize();
