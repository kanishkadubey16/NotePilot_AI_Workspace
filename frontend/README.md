# NotePilot AI Workspace - Frontend 🖥️

This is the fully built, production-ready React + Vite frontend for NotePilot AI. It strictly features a secure JWT-based Authentication system, modern SaaS UI design, and seamless routing.

---

## 📂 Frontend Architecture

```text
frontend/
├── src/
│   ├── components/
│   │   └── ProtectedRoute.jsx   # Guards routes against unauthorized access
│   ├── context/
│   │   └── AuthContext.jsx      # Global state for users, tokens, and persistence
│   ├── pages/
│   │   ├── Home.jsx             # Public landing page
│   │   ├── Login.jsx            # Secure login form with validation
│   │   ├── Signup.jsx           # Secure registration form with validation
│   │   ├── Dashboard.jsx        # Protected dashboard
│   │   └── Workspace.jsx        # Protected AI notes editor
│   ├── services/
│   │   └── api.js               # Centralized Axios instance with JWT interceptors
│   ├── styles/
│   │   └── auth.css             # Modern SaaS animated CSS
│   ├── App.jsx                  # Main React Router setup
│   └── main.jsx                 # Vite Entrypoint
├── .env.local                   # Environment variables (VITE_API_URL)
└── package.json                 # Dependencies
```

---

## 🚀 Setup & Execution

**1. Install Dependencies** (already done):
```bash
npm install
```

**2. Start Development Server**:
```bash
npm run dev
```

Your app will launch locally (usually at `http://localhost:5173`). 
*Note: Make sure your Node backend (`http://localhost:8080`) is running simultaneously!*

---

## 🔐 Auth System Features (Phases 3-10)

1. **Persistent Sessions**: Refreshing the page does not log you out. `AuthContext` quietly checks `localStorage` and verifies validity.
2. **Auto-Injecting Tokens**: The `services/api.js` Axios interceptor silently attaches the `Authorization: Bearer <token>` header to all requests.
3. **Secure Logout Flow**: Clicking logout safely flushes state and clears localStorage.
4. **Professional UX**: 
   - Uses `react-toastify` for elegant error/success popups.
   - Buttons enter a "disabled/loading" state during API transit.
   - Clean, animated glass-card SaaS interface (`auth.css`).
