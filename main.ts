import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { expressMiddleware } from '@apollo/server/express4';
import bodyParser from 'body-parser';
import cors from 'cors';
import typeDefs from './src/schema/user.schema';
import resolvers from './src/resolvers/user.resolvers';
import connectDb from './src/db/database.connection';
import dotenv from 'dotenv';
import { verifyToken } from './src/utils/auth';
import http from 'http';
import { Server, Socket } from 'socket.io';
import User from './src/models/userModel/user.model';
dotenv.config();
connectDb();
const app = express();
const httpServer = http.createServer(app); // Create an HTTP server
export const io = new Server(httpServer);

async function startServer() {
    const PORT = process.env.PORT || 8000;
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: async ({ req }) => {
            // Verify JWT token and add authenticated user to context
            const token = req.headers.authorization || '';
            let user = null;
            try {
                const decoded = await verifyToken(token);
                user = await User.findById(decoded.email);
            } catch (error) {
                // Token verification failed or user not found
            }

            return { user };
        }
    });

    app.use(bodyParser.json());
    app.use(cors());

    await server.start();
    server.applyMiddleware({ app });

    // Socket.IO logic
    io.on('connection', (socket: Socket) => {
        console.log('Socket connected:', socket.id);

        // Handle custom events from clients
        socket.on('chatMessage', (message: string) => {
            // Broadcast the message to all connected clients
            io.emit('chatMessage', message);
        });

        // Handle disconnect event
        socket.on('disconnect', () => {
            console.log('Socket disconnected:', socket.id);
        });
    });

    httpServer.listen(PORT, () => {
        console.log(`App is listening on PORT: http://localhost:${PORT}/graphql`);
    })
}

startServer();