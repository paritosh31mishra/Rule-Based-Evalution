//express downloading code
const express = require('express');
const app = express();

// use cross origin for frontend-backend communication
const cors = require('cors'); // calling cross origin library
// app.use(cors()); // creating object of cors library
// app.use(express.json());

const allowedOrigins = [
  "http://localhost:3000", // Local development
  "https://rule-based-evalution-frontend.onrender.com", // Hosted frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true); // Allow the request
      } else {
        callback(new Error("Not allowed by CORS")); // Block the request
      }
    },
    credentials: true, // Include credentials (if needed)
  })
);

app.use(express.json());




//database connection code start
const mongoose = require('mongoose'); // importing mongodb compiler

mongoose.connect(
  "mongodb+srv://mishraparitosh31:pari31tosh@cluster0.nskf6.mongodb.net/Rule_Engine?retryWrites=true&w=majority&appName=Cluster0", 
  { useNewUrlParser: true, useUnifiedTopology: true }
)
  .then(() => console.log("Database Connected..."))
  .catch((error) => console.error("Database connection failed:", error));

const Rule = require('../backend/api/ruleapi');
app.use('/rules', Rule); // http://localhost:5656/rules - post

app.listen(5556, () => console.log('The server is live now....'));
