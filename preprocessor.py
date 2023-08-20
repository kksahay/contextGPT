from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores.faiss import FAISS
from langchain.text_splitter import CharacterTextSplitter
from langchain.document_loaders import UnstructuredFileLoader
import pickle

loader = UnstructuredFileLoader()
raw_documents = loader.load()

text_splitter = CharacterTextSplitter(
    separator="\n\n",
    chunk_size=600,
    chunk_overlap=100,
    length_function=len,
)
documents = text_splitter.split_documents(raw_documents)
embeddings = OpenAIEmbeddings()
vectorstore = FAISS.from_documents(documents, embeddings)
with open("vectorstore.pkl", "wb") as f:
    pickle.dump(vectorstore, f)