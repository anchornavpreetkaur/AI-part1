const model = require("../services/gemini");

// Function to generate fitness guidelines
const generateFitnessPlan = async (fitnessType,frequency, experience,goal) => {
const prompt = `
  You are a professional fitness coach. Given the user's fitness experience, training frequency, and goal, generate a **structured fitness plan** in **JSON format**.
  
  ### **Schema Requirements**:
  The JSON response should have the following structure:
  
  {
    "fitness_plan": {
      "experience_level": "string",
      "goal": "string",
      "training_frequency": "number",
      "workout_split": [
        {
          "day": "string",
          "focus": "string",
          "exercises": [
            {
              "name": "string",
              "sets": "number",
              "reps": "string"
            }
          ]
        }
      ],
      "diet_recommendations": {
        "caloric_intake": "string",
        "macronutrient_breakdown": {
          "protein": "string",
          "carbs": "string",
          "fats": "string"
        },
        "meal_timing": "string",
        "example_meals": [
          {
            "meal": "string",
            "foods": ["string"]
          }
        ]
      },
      "recovery_tips": ["string"],
      "warnings": ["string"]
    }
  }
  
  ### **User Input**:
  I am a **${experience}** individual looking to focus on **${fitnessType}**.
  My goal is to **${goal}**, and I plan to train **${frequency}** times per week.
  
  Provide a structured fitness guideline including:
  - **Recommended exercises** with sets and reps.
  - **Workout split** (daily training focus).
  - **Dietary recommendations** (caloric intake, macronutrient breakdown, example meals).
  - **Recovery tips** and **warnings** to avoid injury.
  - **Return the response in the above JSON format**.
  `;

  try {
    const result = await model(prompt);
    return result.text;;
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
};

// POST request to /generate-text3 with the following JSON payload:
// {
// "fitnessType": "strength training",
// "frequency": "4",
// "experience": "beginner",
// "goal": "build muscle and increase overall strength"
// }

const generateText3 = async (req, res) => {
  try {
    const { fitnessType, frequency, experience, goal } = req.body;//|| {};

    if (!fitnessType || !frequency || !experience || !goal) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const markdownResponse = await generateFitnessPlan(
      fitnessType,
      frequency,
      experience,
      goal
    );

    const jsonMatch = markdownResponse.match(/```json\s*([\s\S]*?)\s*```/);

    if (!jsonMatch) {
      return res
        .status(500)
        .json({ error: "Invalid response format. No JSON found." });
    }

    let fitnessPlan;
    try {
      fitnessPlan = JSON.parse(jsonMatch[1]);

      // Flatten the plan key
      if (fitnessPlan.plan && fitnessPlan.plan.fitness_plan) {
        fitnessPlan = fitnessPlan.plan.fitness_plan;
      }

      // Standardize caloric intake format
      if (fitnessPlan.diet_recommendations?.caloric_intake) {
        const intakeRange =
          fitnessPlan.diet_recommendations.caloric_intake.match(/\d+/g);
        fitnessPlan.diet_recommendations.caloric_intake = {
          range: intakeRange ? intakeRange.join("-") : "Unknown",
          unit: "calories",
          notes: "Adjust based on individual needs and metabolism",
        };
      }

      // Ensure reps use numeric min-max values
      fitnessPlan.workout_split?.forEach((day) => {
        day.exercises.forEach((exercise) => {
          if (
            typeof exercise.reps === "string" &&
            exercise.reps.includes("-")
          ) {
            const [min, max] = exercise.reps.split("-").map(Number);
            exercise.reps = { min, max };
          } else if (!isNaN(exercise.reps)) {
            exercise.reps = {
              min: Number(exercise.reps),
              max: Number(exercise.reps),
            };
          }
        });
      });

      // Improve warnings format
      if (Array.isArray(fitnessPlan.warnings)) {
        fitnessPlan.warnings = fitnessPlan.warnings.map((warning) => ({
          category: warning.includes("injuries")
            ? "Injury Prevention"
            : "General",
          message: warning,
        }));
      }
    } catch (parseError) {
      return res.status(500).json({ error: "Error parsing JSON response." });
    }

    // Return formatted response
    res.json(fitnessPlan);
  } catch (err) {
    console.error("Error in generateResponse:", err);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

module.exports = generateText3;

