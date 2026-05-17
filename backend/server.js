require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Initialize Express app
const app = express();

// Connect to database
connectDB();

// Middleware
app.use(express.json());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Route setup
app.get('/', (req, res) => {
  res.send('NotePilot AI API is running...');
});

// Routes
app.use('/auth', require('./routes/authRoutes'));
app.use('/notes', require('./routes/noteRoutes'));
app.use('/ai', require('./routes/aiRoutes'));
app.use('/dashboard', require('./routes/dashboardRoutes'));

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
