import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

// ============================================================================
// 🔑 GOOGLE GEMINI API KEY CONFIGURATION
// You can paste your API key directly between the quotes below,
// OR leave it to be loaded from your .env file!
// ============================================================================
const DIRECT_GEMINI_API_KEY = ""; // Optional: Paste key here if not using .env

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Helper function to dynamically retrieve the API key (re-reads .env on demand)
function getActiveApiKey() {
  // 1. Direct constant in code
  if (DIRECT_GEMINI_API_KEY && DIRECT_GEMINI_API_KEY.trim().length > 5) {
    return DIRECT_GEMINI_API_KEY.trim();
  }

  // 2. Read directly from .env file so any edits work immediately without server restart
  try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      const match = content.match(/GEMINI_API_KEY\s*=\s*(["']?)([^"'\r\n]+)\1/);
      if (match && match[2] && match[2].trim().length > 5) {
        return match[2].trim();
      }
    }
  } catch (err) {
    console.error('Error reading .env file:', err);
  }

  // 3. Fallback to process.env
  return process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.trim() : '';
}

// Health & Status check endpoint
app.get('/api/status', (req, res) => {
  const activeKey = getActiveApiKey();
  res.json({
    status: 'online',
    hasApiKey: Boolean(activeKey && activeKey.length > 5),
    maskedKey: activeKey ? `${activeKey.slice(0, 6)}...${activeKey.slice(-4)}` : null,
    project: "What's in My Fridge? - Smart AI Recipe Generator",
    developer: "Arjhun Magalona, BSIT - 3"
  });
});

// Recipe Generation endpoint
app.post('/api/generate-recipes', async (req, res) => {
  try {
    const { ingredients, preference } = req.body;

    // Validate ingredients
    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({
        error: 'Please add at least one ingredient first.'
      });
    }

    const sanitizedIngredients = ingredients
      .map(item => String(item).trim())
      .filter(item => item.length > 0);

    if (sanitizedIngredients.length === 0) {
      return res.status(400).json({
        error: 'Please add at least one valid ingredient.'
      });
    }

    const selectedPreference = preference || 'Quick & Easy';

    // Retrieve active API key
    const apiKey = getActiveApiKey();

    if (!apiKey || apiKey.length < 5) {
      return res.status(400).json({
        error: 'Google Gemini API key is missing. Please save your API key in .env or in server/index.js.'
      });
    }

    // Prompt construction prioritizing user ingredients
    const systemPrompt = `You are a world-class professional chef and culinary AI assistant.
Your task is to create 3 practical, delicious, and realistic recipes based PRIMARILY on the user's available ingredients.

User Ingredients:
${sanitizedIngredients.map(ing => `- ${ing}`).join('\n')}

User Cooking Preference:
${selectedPreference}

Rules:
1. Generate exactly 3 distinct recipe suggestions that highlight and prioritize the provided ingredients.
2. If additional ingredients (like common pantry staples: cooking oil, salt, black pepper, water, butter) are needed, clearly list them in "additionalIngredients".
3. Keep instructions step-by-step, clear, and practical for home cooks.
4. Adapt to the chosen preference:
   - "Quick & Easy": Ready in under 20-25 mins with minimal prep.
   - "Healthy": Nutritious, wholesome, balanced, emphasizing clean cooking.
   - "Budget-friendly": Uses affordable staples, no wastage, cost-efficient.
5. Return ONLY a valid JSON object matching the following structure without any extra markdown formatting or conversational filler:

{
  "recipes": [
    {
      "name": "Recipe Name Here",
      "description": "Short appetizing description (1-2 sentences).",
      "prepTime": "10 mins",
      "cookTime": "15 mins",
      "totalTime": "25 mins",
      "difficulty": "Easy",
      "servings": 2,
      "ingredients": [
        "User ingredient 1",
        "User ingredient 2"
      ],
      "additionalIngredients": [
        "Salt",
        "Olive oil"
      ],
      "steps": [
        "Step 1 instruction...",
        "Step 2 instruction...",
        "Step 3 instruction..."
      ],
      "tips": "Practical chef tip or leftover variation."
    }
  ]
}`;

    // Available Gemini models for this project tier (tries each in order)
    const modelsToTry = [
      'gemini-3.8-flash',
      'gemini-3-flash-preview',
      'gemini-2.5-flash-lite',
      'gemini-3.1-flash-lite-preview',
      'gemini-flash-latest'
    ];

    // Helper: wait for ms milliseconds
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    let textResponse = null;
    let lastError = null;

    for (const modelName of modelsToTry) {
      // Try each model up to 2 times (retry once on overload)
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent`;
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-goog-api-key': apiKey
            },
            body: JSON.stringify({
              contents: [{ parts: [{ text: systemPrompt }] }],
              generationConfig: {
                temperature: 0.7,
                responseMimeType: 'application/json'
              }
            })
          });

          const data = await response.json();

          if (response.ok && data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
            textResponse = data.candidates[0].content.parts[0].text;
            break;
          }

          const errMsg = data.error?.message || `Status ${response.status}`;
          lastError = data.error || { message: errMsg };

          // On overload/high demand, wait briefly and retry
          if (response.status === 503 || errMsg.includes('high demand') || errMsg.includes('overloaded')) {
            console.warn(`Model ${modelName} overloaded (attempt ${attempt}), retrying...`);
            if (attempt < 2) await sleep(2500);
            continue;
          }

          // On quota errors, stop immediately
          if (response.status === 429 || errMsg.includes('RESOURCE_EXHAUSTED')) {
            break;
          }

          // Model not available (404), skip to next model
          console.warn(`Model ${modelName} skipped: ${errMsg}`);
          break;

        } catch (err) {
          lastError = err;
          console.warn(`Model ${modelName} request error (attempt ${attempt}):`, err.message);
          if (attempt < 2) await sleep(1500);
        }
      }

      if (textResponse) break;
    }

    if (!textResponse) {
      console.error('All Gemini models failed. Last error:', lastError);
      const errMsg = (lastError?.message || '').toLowerCase();

      if (errMsg.includes('api_key_invalid') || errMsg.includes('key not valid') || errMsg.includes('invalid_argument')) {
        return res.status(401).json({
          error: 'Your Google Gemini API key was rejected by Google. Please verify your key is correct in your .env file.'
        });
      }

      if (errMsg.includes('resource_exhausted') || errMsg.includes('quota')) {
        return res.status(429).json({
          error: 'Your Gemini API quota has been reached. Please try again after a short wait.'
        });
      }

      if (errMsg.includes('high demand') || errMsg.includes('overloaded') || errMsg.includes('503') || errMsg.includes('unavailable')) {
        return res.status(503).json({
          error: 'The AI service is currently busy. Please wait a few seconds and click Generate again!'
        });
      }

      return res.status(500).json({
        error: "Sorry, we couldn't generate recipes right now. Please try again in a moment."
      });
    }

    // Robust JSON parsing for LLM output (handles fences and trailing text)
    function extractJson(str) {
      let trimmed = str.trim();
      // Remove starting/ending markdown code fences
      trimmed = trimmed.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
      try {
        return JSON.parse(trimmed);
      } catch (e) {
        // Find outer-most JSON object bounds
        const start = trimmed.indexOf('{');
        const end = trimmed.lastIndexOf('}');
        if (start !== -1 && end !== -1 && end > start) {
          return JSON.parse(trimmed.substring(start, end + 1));
        }
        throw e;
      }
    }

    const parsedData = extractJson(textResponse);

    if (!parsedData.recipes || !Array.isArray(parsedData.recipes) || parsedData.recipes.length === 0) {
      return res.status(502).json({
        error: "The AI returned an invalid recipe format. Please try again."
      });
    }

    return res.json({
      success: true,
      preference: selectedPreference,
      ingredientsProvided: sanitizedIngredients,
      recipes: parsedData.recipes
    });

  } catch (error) {
    console.error('Server error handling recipe generation:', error);
    return res.status(500).json({
      error: "Sorry, we couldn't generate recipes right now. Please try again."
    });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
