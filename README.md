# Testing API Calls to Gemini LLM

> [!NOTE]
> How to modify prompts and extend the code for image, audio, or document analysis will be covered in the optional Friday session.
 
---

## Step 0: Prerequisites

- **Gmail Account** – Create a personal Gmail account if you don’t already have one.
- **API Key** – Generate one at [Google AI Studio](https://aistudio.google.com/app/apikey) and store it somewhere safe.

---

## Step 1: Setup Instructions

1. **Clone the repository**  
   ```bash
   git clone https://github.com/tx00-resources-en/AI-part1
   cd AI-part1
   ```

2. **Remove Git history**  
   ```bash
   rm -rf .git
   ```

3. **Configure environment variables**  
   - Open `.env.example`  
   - On **line 1**, replace the dummy key  
     ```
     Jh6AIvfYH87KKL34KllmsHg
     ```  
     with the API key you generated earlier.
   - Rename the file:  
     ```bash
     mv .env.example .env
     ```

4. **Install dependencies**  
   ```bash
   npm install
   ```

5. **Start the development server**  
   ```bash
   npm run dev
   ```

---

## Step 2: Testing the Endpoints with Postman

### **Endpoint 1 – Text Generation**
- **POST** `http://localhost:4000/api/generate-text1`  
- **Body (raw JSON)**:
  ```json
  {
    "prompt": "Write 3 practical tips for staying productive while working from home."
  }
  ```
- **Expected:** Response from Gemini LLM with generated text.
- You can modify prompts in the request body to experiment with different outputs.

### **Endpoint 2 – Fitness Plan (Markdown Output)**
- **POST** `http://localhost:4000/api/generate-text2`  
- **Body (raw JSON)**:
  ```json
  {
    "fitnessType": "strength training",
    "frequency": "4",
    "experience": "beginner",
    "goal": "build muscle and increase overall strength"
  }
  ```
- **Expected:** Response in **Markdown** format.
- You can modify prompts in the request body to experiment with different outputs.

### **Endpoint 3 – Fitness Plan (Structured JSON Output)**
- **POST** `http://localhost:4000/api/generate-text3`  
- **Body (raw JSON)**:
  ```json
  {
    "fitnessType": "strength training",
    "frequency": "4",
    "experience": "beginner",
    "goal": "build muscle and increase overall strength"
  }
  ```
- **Expected:** Structured **JSON** response.
- You can modify prompts in the request body to experiment with different outputs.

---

## Step 3: Code Reference

- **`./controllers/textController1.js`** → Handles `/generate-text1`
- **`./controllers/textController2.js`** → Handles `/generate-text2`
- **`./controllers/textController3.js`** → Handles `/generate-text3`
- **`./services/gemini.js`** → Logic for calling Gemini LLM

---

## Step 4: Model Configuration

- **Temperature** controls randomness in output:  
  - `0.0` → Deterministic  
  - `0.7–1.0` → More random, creative responses  
- Current setting:  
  ```js
  config: {
    temperature: 0.1, // Low randomness, focused and consistent
  }
  ```

---

## Additional Resources

- [Text Generation Docs](https://ai.google.dev/gemini-api/docs/text-generation)  
- [Document Processing Docs](https://ai.google.dev/gemini-api/docs/document-processing)  
- [Image Understanding Docs](https://ai.google.dev/gemini-api/docs/image-understanding)  
- [Audio Processing Docs](https://ai.google.dev/gemini-api/docs/audio)  
- [Structured Output Docs](https://ai.google.dev/gemini-api/docs/structured-output)  


