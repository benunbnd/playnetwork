export default class Players extends Map {
    playersByUser = new Map();
    playersByRoom = new Map();

    add(player) {
        this.set(player.id, player);
        this.playersByUser.set(player.user.id, player);
        this.playersByRoom.set(player.room.id, player); // TODO: It's not needed in room.players

        player.on('destroy', () => {
            this.delete(player.id);
            this.playersByUser.delete(player.user.id);
            this.playersByRoom.delete(player.room.id);
        });

        return player;
    }

    getByUserId(userId) {
        return this.playersByUser.get(userId);
    }

    getByRoomId(roomId) {
        return this.playersByRoom.get(roomId);
    }

    send(name, data) {
        for (const [_, player] of this) {
            player.send(name, data);
        }
    }
}
