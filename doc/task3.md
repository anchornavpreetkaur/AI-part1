<!-- # Task: Build a Structured Health Plan Endpoint

We want to adapt the existing **fitness plan** endpoint so that it works for **health plans**.  
The endpoint should accept dynamic health‑related data from the client (React frontend or Postman), send it to the LLM with a **strict JSON schema prompt**, and return a **parsed, structured JSON** response.

---

### **1. Example Input (Postman)**

```json
{
  "age": 35,
  "gender": "female",
  "healthGoal": "improve cardiovascular endurance",
  "dietPreference": "vegetarian",
  "workoutDays": 4
}
```

---

### **2. Example Realistic Output**

```json
{
  "health_plan": {
    "age": 35,
    "gender": "female",
    "goal": "improve cardiovascular endurance",
    "diet_preference": "vegetarian",
    "workout_days_per_week": 4,
    "weekly_workout_schedule": [
      {
        "day": "Monday",
        "focus": "Cardio – Steady State",
        "activities": [
          { "name": "Treadmill Jog", "duration_minutes": 30, "intensity": "moderate" },
          { "name": "Cycling", "duration_minutes": 20, "intensity": "moderate" }
        ]
      },
      {
        "day": "Wednesday",
        "focus": "Interval Training",
        "activities": [
          { "name": "Running Intervals", "duration_minutes": 25, "intensity": "high" },
          { "name": "Rowing Machine", "duration_minutes": 15, "intensity": "moderate" }
        ]
      }
    ],
    "nutrition_guidelines": {
      "daily_calories": "2,000 kcal",
      "macronutrient_breakdown": {
        "protein": "90g",
        "carbs": "280g",
        "fats": "60g"
      },
      "meal_examples": [
        {
          "meal": "Breakfast",
          "foods": ["Oatmeal with almond milk and berries", "Scrambled tofu with spinach"]
        }
      ]
    },
    "lifestyle_recommendations": [
      "Aim for 7–8 hours of sleep per night",
      "Stay hydrated with at least 2 liters of water daily"
    ],
    "progress_tracking_tips": [
      "Track running distance and pace weekly",
      "Record resting heart rate each morning"
    ]
  }
}
```

---

### **3. Controller Function (`generateHealthText`)**

```js
const generateHealthPlan = require("../services/healthPlan");

const generateHealthText = async (req, res) => {
  try {
    const { age, gender, healthGoal, dietPreference, workoutDays } = req.body;

    if (!age || !gender || !healthGoal || !dietPreference || !workoutDays) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const markdownResponse = await generateHealthPlan(
      age,
      gender,
      healthGoal,
      dietPreference,
      workoutDays
    );

    const jsonMatch = markdownResponse.match(/```json\s*([\s\S]*?)\s*```/);

    if (!jsonMatch) {
      return res.status(500).json({ error: "Invalid response format. No JSON found." });
    }

    let healthPlan;
    try {
      healthPlan = JSON.parse(jsonMatch[1]);

      // Standardize caloric intake format if present
      if (healthPlan.health_plan?.nutrition_guidelines?.daily_calories) {
        const intakeRange = healthPlan.health_plan.nutrition_guidelines.daily_calories.match(/\d+/g);
        healthPlan.health_plan.nutrition_guidelines.daily_calories = {
          range: intakeRange ? intakeRange.join("-") : "Unknown",
          unit: "calories",
          notes: "Adjust based on individual needs and metabolism"
        };
      }
    } catch (parseError) {
      return res.status(500).json({ error: "Error parsing JSON response." });
    }

    res.json(healthPlan);
  } catch (err) {
    console.error("Error in generateHealthText:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

module.exports = generateHealthText;
```

---

### **4. Utility Function (`services/healthPlan.js`)**

```js
const model = require("./gemini");

const generateHealthPlan = async (age, gender, healthGoal, dietPreference, workoutDays) => {
  const prompt = `
You are a certified health and fitness consultant. Based on the user's details, create a **personalized health improvement plan** in **JSON format**.

### Schema Requirements:
{
  "health_plan": {
    "age": "number",
    "gender": "string",
    "goal": "string",
    "diet_preference": "string",
    "workout_days_per_week": "number",
    "weekly_workout_schedule": [
      {
        "day": "string",
        "focus": "string",
        "activities": [
          {
            "name": "string",
            "duration_minutes": "number",
            "intensity": "string"
          }
        ]
      }
    ],
    "nutrition_guidelines": {
      "daily_calories": "string",
      "macronutrient_breakdown": {
        "protein": "string",
        "carbs": "string",
        "fats": "string"
      },
      "meal_examples": [
        {
          "meal": "string",
          "foods": ["string"]
        }
      ]
    },
    "lifestyle_recommendations": ["string"],
    "progress_tracking_tips": ["string"]
  }
}

### User Input:
I am a ${age}-year-old ${gender} aiming to ${healthGoal}.
My diet preference is ${dietPreference}, and I can work out ${workoutDays} days per week.

Please:
- Provide a **weekly workout schedule** tailored to my goal.
- Suggest **nutrition guidelines** aligned with my diet preference.
- Include **lifestyle recommendations** to support my goal.
- Add **progress tracking tips**.
- Return the response in the exact JSON format above.
`;

  try {
    const result = await model(prompt);
    return result.text;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = generateHealthPlan;
```

---

### **5. Key Differences: Fitness vs. Health Version**

| **Aspect** | **Fitness Version** | **Health Version** |
|------------|--------------------|--------------------|
| **Input Fields** | `fitnessType`, `frequency`, `experience`, `goal` | `age`, `gender`, `healthGoal`, `dietPreference`, `workoutDays` |
| **Prompt Role** | "Professional fitness coach" | "Certified health and fitness consultant" |
| **Schema Root Key** | `"fitness_plan"` | `"health_plan"` |
| **Workout Section** | `workout_split` with `exercises` (sets/reps) | `weekly_workout_schedule` with `activities` (duration/intensity) |
| **Diet Section** | `diet_recommendations` with caloric intake, macros, meal timing | `nutrition_guidelines` with daily calories, macros, meal examples |
| **Extra Sections** | `recovery_tips`, `warnings` | `lifestyle_recommendations`, `progress_tracking_tips` |
| **Post‑Processing** | Parses reps into `{min, max}`, formats warnings | Formats daily calories, no reps parsing |

---

### **Optional Activity: Unified Generator**

You can **merge both fitness and health logic** into a single utility function that takes a `type` parameter (`"fitness"` or `"health"`) and switches schema, prompt, and post‑processing accordingly.   -->
