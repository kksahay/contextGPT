import { OpenAI } from 'openai'
import { DiscussServiceClient } from "@google-ai/generativelanguage";
import { GoogleAuth } from "google-auth-library";
import { embedDocuments, qdrantSimilarity } from '../helper/helper.js';
import { Document } from "langchain/document";

const createPrompt = (context, query) => {
    return `Use the following pieces of context to answer the question at the end.
    Here is the context: ${context}. Using the relevant information from context provide and answer to the query: ${query}.
    If you don't know the answer, just say I couldn't find a good match in the document for your query. Don't try to make up an answer.
    Use four sentences maximum and keep the answer as concise as possible.`
}

export const chatRequest = (socket) => {
    console.log('A user connected to WebSocket');
    let client;
    socket.on('session', (model) => {
        if (model.name === 'open-ai') {
            client = new OpenAI({
                apiKey: model.apiKey
            })
        } else {
            client = new DiscussServiceClient({
                authClient: new GoogleAuth().fromAPIKey(model.apiKey),
            });
        }
    })
    const conversationHistory = [];
    socket.on('sendMessage', async (message) => {
        try {
            const query = new Document({
                pageContent: message
            })
            const queryVector = await embedDocuments(query);
            const vectorSimilarity = await qdrantSimilarity('pdf_collection', queryVector.vector);
            const prompt = createPrompt(vectorSimilarity[0].payload.content, message);
            // GPT
            if(model.name == 'open-ai') {
                conversationHistory.push({ role: 'user', content: prompt })
                const chatCompletion = await client.chat.completions.create({
                    model: "gpt-3.5-turbo",
                    messages: conversationHistory,
                })
                const response = chatCompletion.choices[0].message;
                conversationHistory.push(response);
            } else {
            // Palm
                conversationHistory.push({ author: '0', content: prompt })
                const result = await client.generateMessage({
                    model: "models/chat-bison-001",
                    prompt: { messages: conversationHistory },
                })
                const response = result[0].candidates[0];
                conversationHistory.push(response)
            }
            socket.emit("message", response);
        } catch (error) {
            console.log(error)
        }
    });
    socket.on('disconnect', () => {  
        console.log('A user disconnected');
    });
}