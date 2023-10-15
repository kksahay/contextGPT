import { OpenAI } from 'openai'
import { DiscussServiceClient } from "@google-ai/generativelanguage";
import { GoogleAuth } from "google-auth-library";
import md5 from 'md5';

export const validator = async (req, res, next) => {
    const { name, apiKey } = req.body;
    if (name == 'gpt-3.5') {
        const client = new OpenAI({
            apiKey
        })
        try {
            await client.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: "Hi" }],
            })
            return res.status(200).send({
                message: "Model set successfully",
                hash: md5(Date.now()),
            })
        } catch (error) {
            return res.status(401).send(error.message);
        }
    }
    if (name == 'palm-ai') {
        const client = new DiscussServiceClient({
            authClient: new GoogleAuth().fromAPIKey(apiKey),
        });
        try {
            await client.generateMessage({
                model: "models/chat-bison-001",
                prompt: { messages: [{ author: '0', content: "Hi" }] },
            })
            return res.status(200).send({
                message: "Model set successfully",
                hash: md5(Date.now()),
            })
        } catch (error) {
            return res.status(401).send(error);
        }
    }
}