import { useState } from "react";
import Layout from "../components/Layout"
import { useModel } from "../context/ModelContext";
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

function Homepage() {
    const [modelName, setModelName] = useState('');
    const [modelApiKey, setModelApiKey] = useState('');
    const [btnDisabled, setBtnDisabled] = useState(false);
    const { modelInit } = useModel();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setBtnDisabled(true);
        try {
            const { data } = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/model`, {
                name: modelName,
                apiKey: modelApiKey
            });
            const modelInfo = {
                name: modelName,
                apiKey: modelApiKey,
                hash: data.hash,
            }
            modelInit(modelInfo);
            sessionStorage.clear();
            sessionStorage.setItem("model", JSON.stringify(modelInfo));
            toast.success('API Key set successfully!');
            setError(false);
        } catch (error) {
            toast.error('Invalid API Key');
        } finally {
            setBtnDisabled(false);
        }
    }
    
    return (
        <Layout>
            <div><Toaster /></div>
            <div className="text-white mt-10v p-2 text-center font-mono font-medium text-5xl">Chat with your Data</div>
            <form onSubmit={handleSubmit}>
                <div className="flex flex-row items-center justify-center mt-10v">
                    <div className="basis-1/4 mr-3v">
                        <label htmlFor="modes" className="mb-2 text-lg font-medium text-white">Model</label>
                        <select 
                            name="models"
                            id="modes"
                            required
                            onChange={(e) => setModelName(e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-lg rounded-md p-2.5 focus:ring-blue-500 focus:border-blue-500 block w-full bg-gray-700 text-white"
                        >
                            <option value="">Choose a model</option>
                            <option value="gpt-3.5">gpt-3.5</option>
                            <option value="palm-ai">palm-ai</option>
                        </select>
                    </div>
                    <div className="basis-1/4 mr-3v">
                        <label htmlFor="api" className="mb-2 text-lg font-medium text-white">API Key</label>
                        <input 
                            type="password" 
                            id="api"
                            onChange={(e) => setModelApiKey(e.target.value)}
                            className="bg-gray-50 border text-md rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div className="self-end">
                        <button type="submit" disabled={btnDisabled} className="text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-lg px-5 py-2 mb-1v bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-blue-800 disabled:opacity-50 disabled:cursor-not-allowed">
                            Submit
                        </button>
                    </div>
                </div>
            </form>
        </Layout>
    )
}
export default Homepage