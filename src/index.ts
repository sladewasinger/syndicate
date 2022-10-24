import { Server } from 'socket.io';
import express from 'express';
import { createServer } from 'http';

// Use the port that AWS provides or default to 3000. Without this, the deployment will fail:
const port = process.env.PORT || 3000;

const app = express();
app.use(express.static('app'));

const socketServer = createServer(app);
socketServer.listen(port, () => {
  console.log(`socket io server listening on *:${port}`);
});

const io = new Server(socketServer);
