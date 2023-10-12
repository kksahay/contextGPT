import { qdrantCleanup } from "../helper/helper.js"

export const unloader = async (req, res) => {
    try {
        await qdrantCleanup(req.session.model);
        req.session.destroy();
        return res.status(200).send({
            message: "Session destroyed"
        })
    } catch (error) {
        return res.status(500).send(error);
    }
}