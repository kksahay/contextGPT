import express from 'express';
import { uploader, vectorizer } from './controller/uploadController.js';
import { chatRequest } from './controller/chatController.js';
import dotenv from 'dotenv';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io'
import { validator } from './controller/modelController.js';

dotenv.config();
const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT;

app.use(express.json());
app.use(cors());
app.use(fileUpload({
    limits: {
        fileSize: 1 * 1024 * 1024
    },
}));
//for cron-job
app.get('/', (req, res) => {
    res.send({
        message: "success",
    })
});

app.post('/api/model', validator);
app.post('/api/upload', uploader, vectorizer);
/* Experimental
app.get('/api/summarize', summarizer);
app.post('/api/unload', unloader)
*/
const io = new Server(server, {
    cors: {
        origin: "*"
    }
});
io.of('/api/chat').on('connection', chatRequest);

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})