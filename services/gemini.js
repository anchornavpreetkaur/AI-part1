const { GoogleGenAI } = require('@google/genai')

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

// https://ai.google.dev/gemini-api/docs/models
// "models/gemini-2.5-flash", "models/gemini-2.0-flash","models/gemini-2.5-flash-lite",models/"gemini-2.5-flash-image-preview"

// GoogleGenerativeAI setup
const MODEL_NAME = "models/gemini-2.5-flash-lite";

const model = async (contents) => await genAI.models.generateContent({
  model: MODEL_NAME,
  contents,
  config: {
    temperature: 0.1,
  },
})

module.exports = model;