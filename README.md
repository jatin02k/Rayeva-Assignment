# Rayeva AI Systems Assignment

> Full Stack / AI Intern Assignment — Applied AI for Sustainable Commerce

## Live Demo
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

---

## Modules Implemented

| Module | Status | Description |
|--------|--------|-------------|
| Module 1: AI Auto-Category & Tag Generator | ✅ Fully Built | Auto-assigns category, sub-category, SEO tags and sustainability filters for any product |
| Module 3: AI Impact Reporting Generator | ✅ Fully Built | Estimates plastic saved, carbon avoided and local sourcing impact for an order |
| Module 2: AI B2B Proposal Generator | 📋 Architecture Outlined | See architecture section below |
| Module 4: AI WhatsApp Support Bot | 📋 Architecture Outlined | See architecture section below |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React (Vite), Tailwind CSS |
| Backend | Node.js, Express.js |
| AI | Google Gemini 2.5 Flash |
| Database | MongoDB (Mongoose) |
| Logging | MongoDB prompt_logs collection |

---

## Project Structure
```
rayeva-assignment/
│
├── server/
│   ├── db/
│   │   ├── mongoose.js              # DB connection
│   │   └── models/
│   │       ├── CategoryResult.js    # Module 1 schema
│   │       ├── ImpactReport.js      # Module 3 schema
│   │       └── PromptLog.js         # AI prompt/response logs
│   │
│   ├── services/
│   │   ├── ai/
│   │   │   ├── category.prompt.js   # Gemini prompt logic - Module 1
│   │   │   └── impact.prompt.js     # Gemini prompt logic - Module 3
│   │   └── business/
│   │       ├── category.logic.js    # Validation + enrichment - Module 1
│   │       └── impact.logic.js      # Validation + number rounding - Module 3
│   │
│   ├── controllers/
│   │   ├── category.controller.js   # Orchestrates Module 1 flow
│   │   └── impact.controller.js     # Orchestrates Module 3 flow
│   │
│   ├── routes/
│   │   ├── category.routes.js       # POST /api/category
│   │   └── impact.routes.js         # POST /api/impact
│   │
│   ├── middleware/
│   │   └── errorHandler.js          # Global error handling
│   │
│   ├── .env.example
│   └── index.js                     # Entry point
│
└── client/
    └── src/
        ├── pages/
        │   ├── CategoryTagger.jsx   # Module 1 UI
        │   └── ImpactReport.jsx     # Module 3 UI
        ├── components/
        │   ├── Navbar.jsx
        │   └── JsonDisplay.jsx      # Renders AI output
        └── App.jsx
```

---

## Architecture Overview
```
User (React Frontend)
        │
        │  POST /api/category or /api/impact
        ▼
  Express Server (index.js)
        │
        ▼
  Route → Controller
        │
        ├── services/business/   ← validates input (pure JS logic)
        │
        ├── services/ai/         ← sends prompt to Gemini, parses JSON
        │
        ├── services/business/   ← enriches/rounds AI response
        │
        ├── MongoDB              ← saves result to collection
        │
        ├── MongoDB              ← logs prompt + raw response
        │
        ▼
  JSON response → React Frontend
```

### Why AI and Business Logic are Separated

The `services/ai/` folder contains **only** prompt construction and Gemini API calls. The `services/business/` folder contains **only** validation rules, data enrichment and number formatting.

This separation means:
- You can swap Gemini for any other AI model without touching business rules
- You can change validation rules without touching prompts
- Each file has one job, making the codebase easy to test and maintain

---

## Prompt Design Decisions

### 1. Enforcing JSON-only Responses
Every prompt ends with:
> "Return ONLY a valid JSON object. No explanation, no markdown, no backticks."

Without this instruction, Gemini wraps responses in markdown code blocks or adds conversational text like "Here is your result:". This breaks `JSON.parse()` and crashes the server. Even with this instruction, a cleanup step strips any accidental backticks before parsing.

### 2. Passing a Hardcoded Category List
The category list is defined in code and injected into the prompt:
```
Available Categories: Kitchen & Dining, Personal Care, Home & Living...
```
Without constraints, Gemini would invent inconsistent category names on every request — "Personal Hygiene" one time, "Oral Care" another. Hardcoding the list ensures every product gets a category that exists in the actual database and UI.

### 3. Baking Estimation Rules into the Impact Prompt
The impact prompt includes explicit rules:
```
- Each plastic-free product saves 50-200g of plastic
- Each local product avoids 0.2kg of carbon
- Each organic product avoids 0.3kg of carbon
```
This grounds Gemini in real business logic rather than letting it make up arbitrary numbers. The AI handles the reasoning and per-product breakdown while the rules ensure consistency and credibility in the output.

---

## API Endpoints

### Health Check
```
GET /health
Response: { "status": "ok" }
```

### Module 1 — Category Tagger
```
POST /api/category

Request:
{
  "product_name": "Bamboo Toothbrush",
  "product_description": "Biodegradable toothbrush made from organic bamboo"
}

Response:
{
  "success": true,
  "data": {
    "primary_category": "Personal Care",
    "sub_category": "Oral Care",
    "seo_tags": ["bamboo toothbrush", "eco-friendly", "biodegradable"],
    "sustainability_filters": ["plastic-free", "biodegradable", "organic"],
    "confidence_score": 0.98,
    "reasoning": "Bamboo toothbrush falls under personal care oral hygiene",
    "processed_at": "2026-03-05T10:00:00.000Z"
  }
}
```

### Module 3 — Impact Report
```
POST /api/impact

Request:
{
  "products": [
    { "name": "Bamboo Toothbrush", "is_local": true, "tags": ["plastic-free"] },
    { "name": "Organic Cotton Bag", "is_local": false, "tags": ["recycled", "organic"] }
  ]
}

Response:
{
  "success": true,
  "data": {
    "plastic_saved_grams": 150,
    "carbon_avoided_kg": 0.5,
    "local_sourcing_percentage": 50,
    "local_sourcing_summary": "1 of 2 products sourced locally",
    "impact_statement": "Your order saved 150g of plastic and avoided 0.5kg of CO2",
    "breakdown": {
      "per_product": [...]
    }
  }
}
```

---

## Module 2 — B2B Proposal Generator (Architecture)

### How it would work

**Input:**
```json
{
  "client_name": "GreenCorp Ltd",
  "budget": 50000,
  "industry": "hospitality",
  "preferences": ["plastic-free", "locally sourced"]
}
```

**Flow:**
```
Validate input (budget > 0, industry exists)
        ↓
Send to Gemini with product catalog context
        ↓
Gemini suggests product mix + budget allocation
        ↓
Business logic enforces budget limit
        ↓
Save proposal to MongoDB
        ↓
Return structured JSON
```

**Output JSON shape:**
```json
{
  "recommended_products": [],
  "budget_allocation": {},
  "cost_breakdown": {},
  "impact_positioning": "string",
  "total_cost": 48500
}
```

**Key prompt design:** The product catalog and budget limit would be injected into the prompt as hard constraints so Gemini never exceeds the budget.

---

## Module 4 — WhatsApp Support Bot (Architecture)

### How it would work

**Service:** Twilio WhatsApp Business API — receives incoming messages as webhooks

**Flow:**
```
WhatsApp message arrives → Twilio webhook → Express route
        ↓
Classify message intent (order status / return policy / refund)
        ↓
If order status → query MongoDB for real order data
        ↓
Send context + real data to Gemini
        ↓
Gemini generates human-readable response
        ↓
If refund/high-priority → escalate to human agent
        ↓
Log full conversation to DB
        ↓
Send reply via Twilio back to WhatsApp
```

**Escalation Logic:**
- Keywords like "refund", "damaged", "urgent" → flag as high priority
- High priority → skip AI response, notify human agent via email/Slack

**Conversation Logging schema:**
```json
{
  "phone_number": "string",
  "message": "string",
  "intent": "order_status | return_policy | refund | general",
  "ai_response": "string",
  "escalated": false,
  "timestamp": "date"
}
```

---

## Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Google AI Studio API key

### Backend
```bash
cd server
npm install
cp .env.example .env
# Fill in your keys in .env
npm run dev
```

### Frontend
```bash
cd client
npm install
npm run dev
```

### Environment Variables
Create `server/.env` from `server/.env.example`:
```
GEMINI_API_KEY=your_gemini_api_key
MONGODB_URI=your_mongodb_connection_string
PORT=5000
```

---

## Evaluation Criteria Mapping

| Criteria | How it's addressed |
|----------|-------------------|
| Structured AI Outputs | Both modules return strict JSON enforced by prompt design |
| Business Logic Grounding | `services/business/` handles all validation and rules separately from AI |
| Clean Architecture | Clear separation: routes → controllers → services(ai/business) → db |
| Practical Usefulness | Both modules solve real catalog and sustainability reporting problems |
| Creativity & Reasoning | Estimation rules, confidence scores and per-product breakdowns add depth |
