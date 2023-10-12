import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { cleanUp, embedDocuments, prepareDocument, qdrant } from '../helper/helper.js';
import { mkdir } from 'fs/promises'
import { promisify } from 'util'

export const uploader = async (req, res, next) => {
    try {
        await cleanUp();
        if (!req.session.model) {
            return res.status(500).send("Please provide API Key");
        }
        const pdfFile = req.files.pdf;
        const mv = promisify(pdfFile.mv)
        await mkdir('uploads', { recursive: true });
        const filePath = `uploads/pdf-${req.session.model.hash}.pdf`;
        await mv(filePath)
        next();
    } catch (error) {
        res.status(500).send("Error processing PDF");
    }
}

export const vectorizer = async (req, res) => {
    const fileName = `pdf-${req.session.model.hash}.pdf`;
    const loader = new PDFLoader(`uploads/${fileName}`);
    const model = req.session.model;
    try {
        const docs = await loader.load();
        const splittedDocuments = await Promise.all(docs.map(prepareDocument));
        const vectors = await Promise.all(splittedDocuments.flat().map((doc) => embedDocuments(doc, model)));
        await qdrant(vectors, model);
        return res.send({
            message: "Doc upserted in the database"
        });
    } catch (error) {
        return res.send(error)
    }

}