import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';

class SocketService {
    private static instance: SocketService;
    private io: SocketIOServer | null = null;

    private constructor() { }

    public static getInstance(): SocketService {
        if (!SocketService.instance) {
            SocketService.instance = new SocketService();
        }
        return SocketService.instance;
    }

    public init(httpServer: HttpServer): void {
        this.io = new SocketIOServer(httpServer, {
            cors: {
                origin: "http://localhost:5173",
                methods: ["GET", "POST"],
                credentials: true
            }
        });

        this.io.on('connection', (socket: Socket) => {
            console.log('New client connected:', socket.id);

            socket.on('disconnect', () => {
                console.log('Client disconnected:', socket.id);
            });
        });

        console.log('Socket.io initialized');
    }

    public getIO(): SocketIOServer {
        if (!this.io) {
            throw new Error('Socket.io not initialized!');
        }
        return this.io;
    }

    public emit(event: string, data: any): void {
        if (this.io) {
            this.io.emit(event, data);
        }
    }
}

export const socketService = SocketService.getInstance();
