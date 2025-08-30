
const allowedOrigins = ["http://localhost:3000", "https://my.mern.com"];
const corsOptions = {
  origin: allowedOrigins,  // 1️⃣ Allow requests only from this origin (React frontend)
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // 2️⃣ Allowed HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"],  // 3️⃣ Allowed headers
  exposedHeaders: ["Content-Length", "X-Auth-Token"], // 4️⃣ Headers that the browser can access
  credentials: true,  // 5️⃣ Allow cookies / auth headers
  maxAge: 600,        // 6️⃣ Cache preflight response (in seconds)
  preflightContinue: false, // 7️⃣ Pass the preflight response to next middleware
  optionsSuccessStatus: 200 // 8️⃣ Status for successful OPTIONS requests (fix for older browsers)
};


export default corsOptions;