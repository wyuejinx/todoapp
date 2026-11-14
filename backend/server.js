const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const todoRoutes = require('./routes/todoRoutes');

dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/todos', todoRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err.stack);
  res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 5000;
// Binding explicitly to 0.0.0.0 accepts requests from localhost, 127.0.0.1, and local IP
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});