import { Document } from "langchain/document";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { QdrantClient } from "@qdrant/js-client-rest";
import { GooglePaLMEmbeddings } from "langchain/embeddings/googlepalm";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { exec } from 'child_process'
import { promisify } from "util";
import md5 from "md5";

export const cleanUp = async () => {
    const execAsync = promisify(exec)
    const { stderr } = await execAsync('rm -rf uploads')
    if (stderr) {
        throw new Error(stderr)
    }
}

export const prepareDocument = async (page) => {
    let { pageContent, metadata } = page;
    pageContent = pageContent.replace(/\n/g, " ")
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 500,
        chunkOverlap: 20,
    });
    const docs = await splitter.splitDocuments([
        new Document({
            pageContent,
            metadata: {
                pageNumber: metadata.loc.pageNumber,
            }
        })
    ])
    return docs;
}

export const embedDocuments = async (doc, model) => {
    const embeddingModel = new GooglePaLMEmbeddings({
        apiKey: process.env.PALM_API_KEY
    })
    try {
        const embeddings = await embeddingModel.embedQuery(doc.pageContent);
        const hash = md5(doc.pageContent);
        return {
            id: hash,
            vector: embeddings,
            payload: {
                content: doc.pageContent,
                pageNumber: doc.metadata.pageNumber
            }
        }
    } catch (error) {
        throw new Error(error)
    }
}

export const qdrant = async (vectors, model) => {

    const client = new QdrantClient({
        url: process.env.QDRANT_URL,
        apiKey: process.env.QDRANT_API_KEY
    })
    const collectionName = `collection-${model.hash}`;

    await client.createCollection(collectionName, {
        vectors: {
            size: 768,
            distance: 'Cosine'
        },
        optimizers_config: {
            default_segment_number: 2,
        },
    })
    await client.upsert(collectionName, {
        wait: true,
        points: vectors
    })
}

export const qdrantSimilarity = async (collectionName, queryVector) => {
    const client = new QdrantClient({
        url: process.env.QDRANT_URL,
        apiKey: process.env.QDRANT_API_KEY
    });
    const res = await client.search(collectionName, {
        vector: queryVector,
        limit: 1,
    });
    return res;
}

export const qdrantCleanup = async (model) => {
    const client = new QdrantClient({
        url: process.env.QDRANT_URL,
        apiKey: process.env.QDRANT_API_KEY
    })
    const collectionName = `collection-${model.hash}`;
    const response = await client.getCollections();
    const collectionNames = response.collections.map((collection) => collection.name);
    if (collectionNames.includes(collectionName)) {
        await client.deleteCollection(collectionName);
    }
}