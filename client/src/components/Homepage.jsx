import { useState } from "react";
import Layout from "./Layout"

function Homepage() {
    const [model, setModel] = useState({})
    const handleSubmit = (e) => {
        e.preventDefault();
        //check for valid api key
        //set api key in local storage
    }
    
    return (
        <Layout>
            <div>
                <form onSubmit={handleSubmit}>
                    <label>Model</label>
                    <select name="models" id="modes">
                        <option value="gpt-3.5">gpt-3.5</option>
                        <option value="palm-ai">palm-ai</option>
                    </select>
                    <label>Api Key</label>
                    <input type="password"/>
                    <button>Submit</button>
                </form>
            </div>
        </Layout>
    )
}
export default Homepage