
const model = require("../services/gemini");

// POST request to /generate-text2 with the following JSON payload:
// {
// "fitnessType": "strength training",
// "frequency": "4",
// "experience": "beginner",
// "goal": "build muscle and increase overall strength"
// }

const generateText2 = async (req, res) => {

  const { fitnessType, frequency, experience, goal } = req.body;//|| {};

  if (!fitnessType || !frequency || !experience || !goal) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const prompt = `
    I am a ${experience} individual looking to focus on ${fitnessType}.
    My goal is to ${goal}, and I plan to train ${frequency} times per week.
    Provide a structured fitness guideline including recommended exercises, duration, and any diet suggestions.
  `;

  try {
    const result = await model(prompt);
    res.json({ output: result.text });
  } catch (error) {
    res.status(500).json({ error: error.message })
  }


};

module.exports = generateText2;
