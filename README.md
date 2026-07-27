# Claims Management Platform

A production-quality, minimal Claims Management Platform that allows Patients to submit health insurance claims with documents and Insurers to review, approve, or reject them.

## Tech Stack

### Frontend
- **Framework:** React (Vite)
- **Routing:** React Router
- **Form Handling:** React Hook Form
- **Styling:** Tailwind CSS (v4)
- **API Client:** Axios
- **Icons:** Lucide React
- **Notifications:** React Hot Toast

### Backend
- **Runtime:** Node.js
- **Server:** Express.js
- **Database:** MongoDB (via Mongoose ODM)
- **File Uploads:** Multer
- **Security:** JWT (JSON Web Tokens), bcrypt

---

## Folder Structure

```
claims-platform/
├── client/                     # Frontend Vite + React project
│   ├── src/
│   │   ├── components/         # Reusable layouts (Navbar, Sidebar, ClaimTable, StatusBadge, etc.)
│   │   ├── context/            # Authentication State context (AuthContext)
│   │   ├── pages/              # Page views (Login, Patient Dashboard, Claim submission, Insurer Dashboard)
│   │   ├── services/           # Axios API service wrapper
│   │   ├── App.jsx             # Main router configuration
│   │   └── index.css           # Tailwind v4 entry point
│   ├── package.json
│   └── vite.config.js
├── server/                     # Backend Express.js project
│   ├── config/                 # Database configuration (db.js)
│   ├── controllers/            # Request handlers (authController, claimController)
│   ├── middleware/             # Custom middlewares (auth, upload, error)
│   ├── models/                 # Mongoose schemas (User, Claim)
│   ├── routes/                 # Express route entry points (authRoutes, claimRoutes)
│   ├── uploads/                # Directory where files are stored statically
│   ├── utils/                  # Seeder helpers (seeder.js)
│   ├── server.js               # Express app main entry point
│   └── package.json
└── README.md                   # Project documentation
```

---

## Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [MongoDB](https://www.mongodb.com/) (Local server or MongoDB Atlas cluster)

### 1. Clone the project and navigate to the directory
```bash
cd arogya_id/claims-platform
```

### 2. Configure Backend Server
1. Navigate to the server folder:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `server` root directory:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/claims-platform
   JWT_SECRET=supersecretjwtkey12345
   ```
   > [!NOTE]
   > Replace `MONGO_URI` with your MongoDB Atlas cluster URI if you are running it in production.

### 3. Configure Frontend Client
1. Navigate to the client folder:
   ```bash
   cd ../client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

---

## Running the Application

### Running Backend Server
From the `claims-platform/server` directory, run:
```bash
# Run in development mode (using nodemon)
npm run dev

# Run in production mode
npm start
```
*The server will start on port `5000`. Mock users will be seeded automatically on startup.*

### Running Frontend Client
From the `claims-platform/client` directory, run:
```bash
# Run in development server
npm run dev

# Compile production bundle
npm run build
```
*Open your browser and navigate to `http://localhost:5173` to access the interface.*

---

## Demo Credentials
On server startup, the database is seeded automatically with these mock profiles:

### Patient Account
- **Email:** `patient@test.com`
- **Password:** `patient123`
- **Role:** `patient`

### Insurer Account
- **Email:** `insurer@test.com`
- **Password:** `insurer123`
- **Role:** `insurer`

---

## API Documentation

### Authentication Endpoints
- **POST** `/api/auth/login` - Public login route. Returns a JWT and user profiles.
- **GET** `/api/auth/me` - Private route. Returns active profile session.

### Claims Endpoints
- **POST** `/api/claims` - Patient only. Submits claim details with file upload (form-data).
- **GET** `/api/claims/my` - Patient only. Returns list of submitted claims for current patient.
- **GET** `/api/claims/:id` - Patient & Insurer. Returns full claim record and reviewer feedback.
- **GET** `/api/claims` - Insurer only. Returns list of all claims in the system.
- **PATCH** `/api/claims/:id` - Insurer only. Approves/rejects claim and submits comments/approved amount.

---

## Media Placeholders

### Screenshots
* `[Login Screen Screenshot]`
* `[Patient Dashboard Screenshot]`
* `[Claim Submission Form Screenshot]`
* `[Insurer Admin panel Screenshot]`

### Demonstration Video
* `[Walkthrough demonstration video path]`

---

## Future Improvements
- Paginated table grids for large dataset performance
- Email notifications when claims are reviewed
- Analytics charts on insurer dashboards showing payout rates
- Multi-file attachments and OCR scanning of receipts
