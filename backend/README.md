# NotePilot AI - Full Backend System 🚀

This is the complete, scalable, and fully functioning Node.js/Express backend for **NotePilot AI**. It features a robust JWT-based authentication system, a complete Notes Management system, and **powerful Generative AI integrations** powered by Google Gemini.

---

## 📂 Updated Folder Architecture

```text
backend/
├── config/
│   └── db.js                 # MongoDB connection logic
├── controllers/
│   ├── authController.js     # Authentication business logic
│   ├── noteController.js     # Notes CRUD, search, and filter logic
│   └── aiController.js       # AI endpoints & usage tracking
├── middleware/
│   ├── authMiddleware.js     # JWT verification & route protection
│   └── errorMiddleware.js    # Global error handler & 404 handler
├── models/
│   ├── User.js               # User schema with AI usage tracking & bcrypt
│   └── Note.js               # Note schema with AI fields & timestamps
├── routes/
│   ├── authRoutes.js         # /auth endpoints
│   ├── noteRoutes.js         # /notes endpoints
│   └── aiRoutes.js           # /ai endpoints
├── services/
│   └── aiService.js          # Reusable Google Gemini prompt logic
├── utils/
│   └── generateToken.js      # JWT generation helper
├── .env                      # Active environment variables (GEMINI_API_KEY, MONGO_URI, etc)
├── .env.example              # Template for environment variables
├── package.json              # Dependencies and NPM scripts
└── server.js                 # Main application entry point
```

---

## 🛠️ Testing & Running Instructions

**1. Start the Server** (Uses Nodemon):
```bash
cd backend
npm run dev
```

**2. Authentication Setup (Required for AI/Notes APIs)**
1. Send a request to `POST /auth/signup` or `POST /auth/login`.
2. Copy the `token` string from the JSON response.
3. For all `/notes` and `/ai` endpoints, add this specific header:
   - **Key:** `Authorization`
   - **Value:** `Bearer <YOUR_COPIED_TOKEN>`

---

## 🤖 Example AI API Requests & Responses

*Note: All endpoints require a valid Note ID with actual content in the database.*

### 1. Generate Smart Summary
- **Endpoint:** `POST /ai/summary/:noteId`
- **Behavior:** Queries Gemini, saves directly to the database, tracks AI usage.
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "summary": "This note discusses sprint planning, frontend tasks, and backend API improvements."
  }
  ```

### 2. Extract Action Items
- **Endpoint:** `POST /ai/action-items/:noteId`
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "actionItems": [
      "Design dashboard UI",
      "Implement JWT middleware",
      "Deploy backend on Render"
    ]
  }
  ```

### 3. Auto-Suggest Professional Title
- **Endpoint:** `POST /ai/suggest-title/:noteId`
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "title": "Weekly Sprint Planning Notes"
  }
  ```

### 4. Smart Tag Suggestions
- **Endpoint:** `POST /ai/suggest-tags/:noteId`
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "tags": ["backend", "meeting", "planning"]
  }
  ```

### 5. AI Writing Improvement
- **Endpoint:** `POST /ai/improve-writing/:noteId`
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "suggestions": "The team met today to finalize the backend architecture..."
  }
  ```

---

## 🛡️ Robust AI Error Handling

The API employs strict error validation before ever communicating with Gemini:
- **Invalid ID Format:** `400 Bad Request` ("Invalid note ID format")
- **Unauthorized / Not Found:** `404 Not Found` ("Note not found or user not authorized")
- **Empty Note Content:** `400 Bad Request` ("Note has no content to process")
- **Gemini Timeout / Failure:** Caught safely via `catch`, passing a clean error to the global handler without crashing the server.
