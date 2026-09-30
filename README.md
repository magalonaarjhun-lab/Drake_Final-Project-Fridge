# What's in My Fridge? — Smart AI Recipe Generator

> **Application Development & Emerging Technologies (Final Project)**  
> **Student Developer:** Arjhun Magalona  
> **Course & Year:** BSIT - 3  
> **Academic Submission:** 2026  

---

## 🍳 Overview

**"What's in My Fridge?"** is a modern, responsive, and real AI-integrated web application designed to help households, students, and home cooks transform everyday pantry and fridge leftovers into creative, delicious meals.

Users enter the ingredients they currently have on hand and choose their cooking preference. The application securely sends the ingredients to **Google Gemini AI**, which dynamically crafts 3 custom, practical recipes tailored to the available items.

---

## ✨ Features

- **Intuitive Ingredient Management**:
  - Add ingredients by typing and pressing **Enter**, typing a **comma (,)**, or clicking **+ Add**.
  - **Quick-Add Pills**: Instant 1-click addition for common staples (*Chicken, Eggs, Garlic, Onion, Rice, Tomatoes, Cheese*).
  - **Interactive Chip Tags**: Remove individual ingredients with `×` or clear all in one click.
  - Automatic duplicate prevention and text normalization.

- **Cooking Preference Selector**:
  - ⚡ **Quick & Easy**: Ready in under 20 minutes with minimal prep.
  - ❤️ **Healthy**: Nutritious, wholesome, and balanced.
  - 💰 **Budget-Friendly**: Uses affordable staples to minimize food waste.

- **Real Google Gemini AI Integration**:
  - Real dynamic generation using Google Gemini Flash models.
  - Returns structured recipe JSON with preparation time, cook time, difficulty level, portions, user ingredients checklist, additional pantry staples, step-by-step instructions, and practical chef tips.
  - **Zero Key Exposure**: Backend Express proxy at `/api/generate-recipes` protects your Gemini API key from client-side inspection.

- **Saved Recipes Collection**:
  - Save favorite recipes locally using browser `localStorage` (persists across page reloads).
  - Live search & filter across saved recipes by recipe title or ingredients.
  - One-click recipe removal and full recipe view.
  - Quick clipboard copy for sharing recipes.

- **Modern Aesthetic & Visual Fidelity**:
  - Deep midnight navy palette (`#090D24`), purple gradient accents (`#6C35E8`, `#8B3FEF`, `#C02BEA`), rounded glassmorphic cards, and subtle glowing indicators matching the project specification.

---

## 🛠️ Architecture & Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite, Vanilla CSS Design System, Lucide Icons, Canvas Confetti |
| **Backend API** | Node.js, Express, CORS, Dotenv |
| **AI Provider** | Google Gemini Generative AI (`gemini-2.5-flash` / `gemini-1.5-flash` / `gemini-2.0-flash`) |
| **Storage** | Client `localStorage` (for Saved Recipes) & `.env` (for API Key) |

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** (bundled with Node.js)
- A free **Google Gemini API Key** from [Google AI Studio](https://aistudio.google.com/app/apikey)

### 2. Configure Environment Variables
Open the `.env` file in the project root:
```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5000
```
*(Alternatively, you can click the ✨ icon in the top right of the running application to enter and test your API key directly through the UI modal.)*

### 3. Start the Application
Run the unified fullstack development script:
```bash
npm run dev
```

This concurrently launches:
- **Express Backend**: [http://localhost:5000](http://localhost:5000)
- **Vite React Frontend**: [http://localhost:5173](http://localhost:5173)

Open your web browser and navigate to:
👉 **`http://localhost:5173`**

---

## 📁 Project Structure

```
Drake_Final-Project-Fridge/
├── .env                   # Environment variables (GEMINI_API_KEY)
├── .env.example           # Example environment template
├── index.html             # HTML entry point with Google Fonts
├── package.json           # Dependencies and scripts
├── vite.config.js         # Vite configuration with API proxy to port 5000
├── public/
│   └── favicon.svg        # SVG logo matching the circular design
├── server/
│   └── index.js           # Express API server & Gemini integration endpoint
└── src/
    ├── main.jsx           # React app mount
    ├── App.jsx            # Main app container & state management
    ├── index.css          # Design system & CSS styles
    └── components/
        ├── Navbar.jsx             # Top header & tab switcher
        ├── HeroSection.jsx        # Rounded hero card with badge & vector art
        ├── IngredientInput.jsx    # Input field, quick-add pills & tags
        ├── PreferenceSelector.jsx # 3 large preference cards
        ├── GenerateButton.jsx     # AI generation button with loading state
        ├── RecipeResults.jsx      # AI results section
        ├── RecipeCard.jsx         # Card with instructions, tips & save/share
        ├── SavedRecipes.jsx       # Saved collection with search & removal
        ├── ProjectModal.jsx       # College defense modal & API settings
        └── Footer.jsx             # Personalization footer
```

---

## 🎓 Evaluation & Defense Notes

- **Student Developer**: Arjhun Magalona
- **Course**: Application Development & Emerging Technologies (BSIT - 3)
- **Security Compliance**: API keys are strictly kept on the server side (`/api/generate-recipes`) and never exposed in browser network responses or client-side bundles.
- **Fail-Safe Robustness**: Handles invalid keys, rate limits, empty inputs, network disconnects, and malformed AI outputs with graceful, user-friendly notices.
