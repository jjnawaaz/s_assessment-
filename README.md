# 🧾 Claims Intake & Routing System  
**Synapsx Assessment**

An automated insurance **claim intake, validation, and routing system** built with Node.js, TypeScript, Express, and an LLM (Grok via OpenAI-compatible API).

The system ingests FNOL documents (PDF/TXT), extracts structured claim data using an LLM, validates required fields deterministically, routes the claim using business rules, and provides a human-readable explanation for every routing decision.

---

## 📌 Key Highlights

- ✅ **LLM used only for semantic understanding**
- ✅ **All business decisions are deterministic**
- ✅ **Explainable routing outcomes**
- ✅ **Production-grade separation of concerns**
- ✅ **Extensible rule engine**

---

## 🏗️ High-Level Architecture

Client Upload
↓
Text Extraction (PDF / TXT)
↓
LLM Semantic Extraction (Grok / LLaMA)
↓
Deterministic Validation
↓
Rule-Based Routing Engine
↓
Human-Readable Explanation


---

## 🎯 Design Principles

### 1. Separation of Concerns
- **LLM** → understands unstructured text
- **Code** → validates, routes, and decides

This prevents hallucinations from influencing business logic.

---

### 2. Deterministic Decision Making
Routing logic is implemented entirely in TypeScript.  
Given the same input, the system always produces the same output.

---

### 3. Explainability
Every routing decision includes a **clear explanation** describing *why* the claim was routed to a particular queue.

---

### 4. Safety First
- Missing or unclear data → `null`
- Claims with missing mandatory fields → **Manual Review**
- No guessing, no assumptions

---

## 📂 Project Structure

```
src/
├── routes/
│ └── upload.ts
│ # API entry point
│ # Handles file upload and orchestrates the full pipeline
│
├── services/
│ ├── fieldExtractor.ts
│ │ # LLM-based semantic extraction (Grok)
│ │
│ ├── claimValidator.ts
│ │ # Deterministic validation of mandatory fields
│ │
│ ├── claimRouter.ts
│ │ # Rule-based routing engine (Chain of Responsibility)
│ │
│ ├── routeExplanation.ts
│ │ # Human-readable explanation for routing decisions
│ │
│ └── llmClient.ts
│ # OpenAI-compatible Grok client
│
├── prompts/
│ └── extractFieldsPrompt.ts
│ # Strict LLM prompt enforcing schema & JSON-only output
│
├── types/
│ ├── extractedFields.ts
│ │ # Canonical FNOL schema
│ │
│ └── claimRoute.ts
│ # Allowed routing outcomes
│
└── index.ts
```

# Express server bootstrap

---

## 🔄 Processing Flow (Step by Step)

### 1️⃣ File Upload
- Endpoint: `POST /api/upload`
- Accepts **PDF** and **TXT** files
- Uses `multer` with in-memory storage

---

### 2️⃣ Text Extraction
- **PDF** → parsed using `pdf-parse v2`
- **TXT** → read directly
- Output: `rawText`

---

### 3️⃣ Semantic Extraction (LLM)
- `rawText` is sent to **Grok (LLaMA-3.3)** using an OpenAI-compatible API
- The prompt enforces:
  - JSON-only output
  - Strict schema
  - `null` for missing fields
  - No hallucination

Example schema:
```ts
policyInformation.policyNumber
incidentInformation.date
assetDetails.assetType


4️⃣ Validation (Deterministic)

Mandatory fields are checked in TypeScript.

If a required field is:

null

empty

missing

…it is added to missingFields.

5️⃣ Routing Engine

Routing is implemented using a Chain of Responsibility pattern.

Rules are evaluated in order:

Manual Review

Missing mandatory fields

Fast-track

Estimated damage < 25,000

Investigation Flag

Fraud indicators in description

Specialist Queue

Injury claims

Standard Processing

Default fallback

6️⃣ Explanation Layer

A human-readable explanation is generated describing why the route was chosen.

📤 Example API Response
{
  "extractedFields": {
    "policyInformation": {
      "policyNumber": null,
      "policyholderName": null,
      "effectiveDates": null
    }
  },
  "missingFields": [
    "policyInformation.policyNumber",
    "incidentInformation.date"
  ],
  "recommendedRoute": "Manual Review",
  "routingExplanation": "The claim was routed to Manual Review because mandatory fields are missing."
}

🚀 Getting Started
1️⃣ Install Dependencies
npm install

2️⃣ Environment Variables

Create a .env file:

GROK_API_KEY=your_groq_api_key
GROK_API_URL=https://api.groq.com/openai/v1
LLM_MODEL=llama-3.3-70b-versatile
PORT=3000


3️⃣ Run the Server
npm run dev


4️⃣ Upload a File

URL: POST http://localhost:3000/api/upload

Body → form-data

Key: file

Type: File (PDF / TXT)


🧪 Testing Scenarios
✅ Valid FNOL PDF

Structured fields extracted

Route: Fast-track or Standard Processing

⚠️ Incomplete / Non-FNOL PDF

Many fields → null

Route: Manual Review


🧠 Design Rationale
Why not let the LLM decide routing?

LLMs are probabilistic and may hallucinate.
Routing must be auditable, predictable, and safe.

Why Chain of Responsibility?

Ordered rules

First match wins

Easy to extend

Mirrors real insurance workflow engines

Why validate after extraction?

Even a perfect LLM may receive incomplete documents.
Validation ensures the system behaves safely under all inputs.

📈 Possible Enhancements

Confidence scores per extracted field

OCR fallback for scanned PDFs

Persistent storage (database)

Async processing with queues

UI dashboard for manual review

✅ Summary

This project demonstrates a real-world approach to combining LLMs with traditional backend engineering:

AI for understanding

Code for decisions

Clear, explainable outcomes

👤 Author

Built as part of the Synapsx Technical Assessment.
