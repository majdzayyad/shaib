import { Game } from "./game";
import { Server, Socket } from "socket.io";
import { createServer } from "http";

export type Room = {
    game: Game | null;
    players: PlayerConnection[];
    roomSize: number;
    isFull: boolean;
}

export type PlayerConnection = {
    playerName: string;
    roomId: string;
    socket: Socket;
}

type CardObject = {
    rank: string;
    suit: string;
}

type PlayerState = {
    playerName: string;
    cards: CardObject[];
}

export type GameState = PlayerState[];

export class GameManager {
    private rooms: Map<string, Room>;
    private players: Map<string, PlayerConnection>;
    private server: Server;
    private static instance: GameManager;

    private constructor() {
        this.rooms = new Map();
        this.players = new Map();
        const httpServer = createServer();
        this.server = new Server(httpServer)
    }

    public static getInstance() {
        if (!GameManager.instance) {
            GameManager.instance = new GameManager();
        }
        return GameManager.instance;
    }

    public createRoom(roomId: string, roomSize: number, roomOwner: string) {
        this.addSocket(roomId, roomOwner);
        this.rooms.set(roomId, {
            game: null,
            players: [this.getPlayer(roomId, roomOwner)],
            isFull: false,
            roomSize
        });
    }

    public deleteRoom(roomId: string) {
        this.server.in(roomId).disconnectSockets();
        this.rooms.delete(roomId);
    }

    public joinRoom(roomId: string, playerName: string) {
        const room = this.rooms.get(roomId);
        if (!room) {
            throw new Error("Room does not exist");
        }
        if (room.isFull) {
            throw new Error("Cannot join full room");
        }
        this.addSocket(roomId, playerName);
        room.players.push(this.getPlayer(roomId, playerName));
        if (room.players.length === room.roomSize) {
            room.isFull = true;
            this.playGame(roomId);
        }
    }

    public playGame(roomId: string) {
        const room = this.rooms.get(roomId) as Room;
        room.game = new Game(room.players.map((player) => player.playerName));
        for (const player of room.players) {
            player.socket.on("play turn", (payload) => {
                const { cards, opponentName, chosedCard } = JSON.parse(payload);
                if (room.game === null) {
                    throw new Error("Game not started");
                }
                room.game.playTurn(player.playerName, cards, opponentName, chosedCard);
                const playerStates = room.game.getPlayerStates();
                this.emitToRoom(roomId, playerStates);
                if (room.game.isGameOver()) {
                    this.deleteRoom(roomId);
                }
            });
        }
    }

    private addSocket(roomId: string, playerName: string) {
        this.server.on("connection", (socket) => {
            socket.join(roomId);
            this.players.set(roomId + playerName, {
                playerName,
                roomId,
                socket
            });
        });
    }

    private getPlayer(roomId: string, playerName: string) {
        return this.players.get(roomId + playerName) as PlayerConnection;
    }

    private emitToRoom(roomId: string, message: GameState) {
        this.server.in(roomId).emit(JSON.stringify(message));
    }

}