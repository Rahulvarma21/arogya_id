const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

const path = require('path');

// Connect to Database
connectDB().then(() => {
  // Seed mock users
  const seedMockUsers = require('./utils/seeder');
  seedMockUsers();
});

const app = express();

const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
};

app.use(cors(corsOptions));

// Handle preflight requests
app.options("*", cors(corsOptions));app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use((req, res, next) => {
  console.log(req.method, req.originalUrl);
  next();
});

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});


// Routes
const authRoutes = require('./routes/authRoutes');
const claimRoutes = require('./routes/claimRoutes');
const errorHandler = require('./middleware/error');

app.use('/api/auth', authRoutes);
app.use('/api/claims', claimRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({ success: true, message: 'Claims Management API is running' });
});

// Error Handler Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});