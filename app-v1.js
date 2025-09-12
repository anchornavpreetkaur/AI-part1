const express = require('express');
const dotenv = require('dotenv');
const app = express();
dotenv.config();
const generateText  = require("./controllers/textController");
// console.log("GEMINI API KEY:", process.env.GEMINI_API_KEY ? "Loaded ✅" : "Not Found ❌");

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running");
});


app.post('/generate-text',generateText );

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// npm init -y
// npm install express dotenv multer @google/genai





