require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const ticketRoutes = require('./routes/ticketRoutes');
const errorHandler = require('./middleware/errorHandler');

// Connect to MongoDB Atlas
connectDB();

const app = express();

// Configure CORS correctly to avoid cross-origin blocks
const corsOptions = {
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};
app.use(cors(corsOptions));

// Enable Body Parser for JSON payloads
app.use(express.json());

// Main Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'DeskFlow API is operating smoothly' });
});

// Setup Ticket Routes
app.use('/api/tickets', ticketRoutes);
app.use('/', ticketRoutes);

// Page Not Found Handler
app.use((req, res, next) => {
  res.status(404);
  const error = new Error(`Not Found - ${req.originalUrl}`);
  next(error);
});

// Global Exception Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`DeskFlow Server is actively running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode.`);
});
