import express from 'express';
import { uploader, vectorizer } from './controller/uploadController.js';
import { chatRequest } from './controller/chatController.js';
import dotenv from 'dotenv';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io'
import { summarizer } from './controller/summaryController.js';
import md5 from 'md5';
import { sessionMiddleware } from './controller/sessionController.js';
import { unloader } from './controller/unloadController.js';

dotenv.config();
const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT;

app.use(sessionMiddleware)
app.use(express.json());
app.use(cors());
app.use(fileUpload({
    limits: {
        fileSize: 1 * 1024 * 1024
    },
}))

app.post('/api/model', (req, res) => {
    const { name, apiKey } = req.body;
    const hash = md5(Date.now());
    req.session.model = {
        name,
        apiKey,
        hash
    }
    req.session.save(() => {
        res.send(req.session.model);
    })
})

app.post('/api/upload', uploader, vectorizer);
/* Experimental
app.get('/api/summarize', summarizer);
 */
app.post('/api/unload', unloader)

const io = new Server(server);

io.of('/api/chat').on('connection', chatRequest);

/* Testing 
app.get('/', (req, res) => {
    res.sendFile(new URL('./index.html', import.meta.url).pathname);
}) 
*/

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})