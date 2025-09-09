
const model = require("../services/gemini");


// POST request to /generate-text1 with the following JSON payload:
// {
//   "prompt": "Write 3 practical tips for staying productive while working from home."
// }

const generateText1 = async (req, res) => {
    const { prompt } = req.body || {};

    if (!prompt) {
        return res.status(400).json({ message: "Prompt is required" });
    }

    try {
        const result = await model(prompt)
        res.json({ output: result.text })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

module.exports = generateText1;

