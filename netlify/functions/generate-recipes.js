// Helper to generate recipes with Gemini AI
async function generateRecipes(body, rawApiKey) {
  const { ingredients, preference } = body;

  // Validate ingredients
  if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
    return {
      status: 400,
      data: { error: 'Please add at least one ingredient first.' },
    };
  }

  const sanitizedIngredients = ingredients
    .map((item) => String(item).trim())
    .filter((item) => item.length > 0);

  if (sanitizedIngredients.length === 0) {
    return {
      status: 400,
      data: { error: 'Please add at least one valid ingredient.' },
    };
  }

  const selectedPreference = preference || 'Quick & Easy';

  const apiKey = (rawApiKey || '').trim();
  if (!apiKey || apiKey.length < 5) {
    return {
      status: 400,
      data: {
        error:
          'Google Gemini API key is missing. Please add GEMINI_API_KEY in your Netlify site settings (Site configuration -> Environment variables) and trigger a redeploy.',
      },
    };
  }

  const systemPrompt = `You are a world-class professional chef and culinary AI assistant.
Your task is to create 3 practical, delicious, and realistic recipes based PRIMARILY on the user's available ingredients.

User Ingredients:
${sanitizedIngredients.map((ing) => `- ${ing}`).join('\n')}

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

  const modelsToTry = [
    'gemini-3-flash-preview',
    'gemini-3.1-flash-lite-preview',
    'gemini-3.8-flash',
    'gemini-flash-latest',
  ];

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  let textResponse = null;
  let lastError = null;

  for (const modelName of modelsToTry) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent`;
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': apiKey,
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: systemPrompt }] }],
            generationConfig: {
              temperature: 0.7,
              responseMimeType: 'application/json',
            },
          }),
        });

        const data = await response.json();

        if (
          response.ok &&
          data.candidates &&
          data.candidates[0]?.content?.parts[0]?.text
        ) {
          textResponse = data.candidates[0].content.parts[0].text;
          break;
        }

        const errMsg = data.error?.message || `Status ${response.status}`;
        lastError = data.error || { message: errMsg };

        if (
          response.status === 503 ||
          errMsg.includes('high demand') ||
          errMsg.includes('overloaded')
        ) {
          if (attempt < 2) await sleep(2000);
          continue;
        }

        if (response.status === 429 || errMsg.includes('RESOURCE_EXHAUSTED')) {
          break;
        }

        break;
      } catch (err) {
        lastError = err;
        if (attempt < 2) await sleep(1000);
      }
    }

    if (textResponse) break;
  }

  if (!textResponse) {
    console.error('All Gemini models failed. Last error:', lastError);
    const errMsg = (lastError?.message || '').toLowerCase();

    if (
      errMsg.includes('api_key_invalid') ||
      errMsg.includes('key not valid') ||
      errMsg.includes('invalid_argument')
    ) {
      return {
        status: 401,
        data: {
          error:
            'Your Google Gemini API key was rejected by Google. Please verify your GEMINI_API_KEY in Netlify environment variables.',
        },
      };
    }

    if (errMsg.includes('resource_exhausted') || errMsg.includes('quota')) {
      return {
        status: 429,
        data: {
          error:
            'Your Gemini API quota has been reached. Please try again after a short wait.',
        },
      };
    }

    return {
      status: 500,
      data: {
        error:
          "Sorry, we couldn't generate recipes right now. Please try again in a moment.",
      },
    };
  }

  function extractJson(str) {
    let trimmed = str.trim();
    trimmed = trimmed
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();
    try {
      return JSON.parse(trimmed);
    } catch (e) {
      const start = trimmed.indexOf('{');
      const end = trimmed.lastIndexOf('}');
      if (start !== -1 && end !== -1 && end > start) {
        return JSON.parse(trimmed.substring(start, end + 1));
      }
      throw e;
    }
  }

  try {
    const parsedData = extractJson(textResponse);

    if (
      !parsedData.recipes ||
      !Array.isArray(parsedData.recipes) ||
      parsedData.recipes.length === 0
    ) {
      return {
        status: 502,
        data: {
          error: 'The AI returned an invalid recipe format. Please try again.',
        },
      };
    }

    return {
      status: 200,
      data: {
        success: true,
        preference: selectedPreference,
        ingredientsProvided: sanitizedIngredients,
        recipes: parsedData.recipes,
      },
    };
  } catch (parseError) {
    return {
      status: 502,
      data: {
        error: 'Failed to parse AI recipe data. Please try again.',
      },
    };
  }
}

// Netlify Functions v2 handler (modern Web Request/Response)
export default async (req, context) => {
  if (req.method === 'OPTIONS') {
    return new Response('', {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
    });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  let body = {};
  try {
    body = await req.json();
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  const result = await generateRecipes(body, process.env.GEMINI_API_KEY);
  return new Response(JSON.stringify(result.data), {
    status: result.status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
};

// Netlify Functions v1 handler (AWS Lambda event format fallback)
export const handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  let body = {};
  try {
    body = JSON.parse(event.body || '{}');
  } catch (err) {
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Invalid JSON body' }),
    };
  }

  const result = await generateRecipes(body, process.env.GEMINI_API_KEY);
  return {
    statusCode: result.status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify(result.data),
  };
};

// Route config for Netlify Functions v2
export const config = {
  path: '/api/generate-recipes',
};
