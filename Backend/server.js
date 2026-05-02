require('dotenv').config();
const app = require('./src/app');
const cors = require('cors');

// Enable CORS for all routes
app.use(
  cors({
    origin: "http://localhost:5173", // Allow all origins
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);



app.listen(3000, () => {
  console.log('Server is running on port 3000');
});