import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { OpenAI } from 'openai'
import { prepareDocument } from '../helper/helper.js'
import { DiscussServiceClient } from "@google-ai/generativelanguage";
import { GoogleAuth } from "google-auth-library";

export const summarizer = async (req, res) => {
    const fileName = 'test.pdf';
    const loader = new PDFLoader(`uploads/${fileName}`);
    const client = new DiscussServiceClient({
        authClient: new GoogleAuth().fromAPIKey(process.env.PALM_API_KEY),
    });
    const model = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    })
    try {
        const docs = await loader.load();
        const splittedDocuments = await Promise.all(docs.map(prepareDocument))
        splittedDocuments = splittedDocuments.flat();        
        res.send({
            message: "Doc summarized successfully"
        })
    } catch (error) {
        res.send(error);
    }
    return;
}