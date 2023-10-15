import { useEffect, useState } from "react";
import Layout from "./Layout"
import { useModel } from "../context/ModelContext";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

function Homepage() {
    const [modelName, setModelName] = useState('');
    const [modelApiKey, setModelApiKey] = useState('');
    const [error, setError] = useState(false);

    const { modelInit } = useModel();
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
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
            navigate('/upload');
            setError(false);
        } catch (error) {
            setError(true);
        }
    }

    return (
        <Layout>
            <div>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="modes">Model</label>
                    <select 
                        name="models"
                        id="modes"
                        required
                        onChange={(e) => setModelName(e.target.value)}
                    >
                        <option value="">--Please choose a model--</option>
                        <option value="gpt-3.5">gpt-3.5</option>
                        <option value="palm-ai">palm-ai</option>
                    </select>
                    <label htmlFor="api">Api Key</label>
                    <input 
                        type="password" 
                        id="api"
                        onChange={(e) => setModelApiKey(e.target.value)}
                    />
                    <button type="submit">Submit</button>
                </form>
            </div>
        </Layout>
    )
}
export default Homepage