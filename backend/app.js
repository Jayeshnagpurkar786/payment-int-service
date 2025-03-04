const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const { specs, swaggerUi } = require('./config/swagger'); // Ensure correct path to swagger.js

const app = express();

// Load environment variables from .env file
dotenv.config();

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:3000', // Allow only your frontend to access the backend
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Allow cookies to be sent along with the request
  allowedHeaders: 'Content-Type,Authorization'
};

app.use(cors(corsOptions)); // Apply CORS middleware with options

// Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname)));

// Set up Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Routes
const route = require('./routes/routes');
app.use('/', route);

// Simple test route
app.get('/', (req, res) => {
  res.status(200).json({ status: 'Ok' });
});

// Error handler middleware
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
};

app.use(errorHandler);

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
