require('dotenv').config()
const express = require('express')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')
const connectToDb = require('./config/mongodb')
const userRouters = require('./routes/userRoutes')
const creditsRouters = require('./routes/creditsRoutes')
const aiRoutes = require('./routes/aiRoutes')
const videoRoutes = require('./routes/videoRoutes')
const jobsRoutes = require('./routes/jobsRoutes')
const { notFound, errorHandler } = require('./middlewares/errorMiddleware')

const PORT = process.env.PORT || 5000

// middleware
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: "http://localhost:5173",  // Change this to your frontend URL
    credentials: true, // Allows cookies and authentication headers
}));

// connecting to the database
connectToDb()


// routers
app.use('/api/users', userRouters)
app.use('/api/credits', creditsRouters)
app.use('/api/video', videoRoutes)
app.use('/api/ai', aiRoutes)
app.use('/api/jobs', jobsRoutes)
app.use("/clips", express.static(path.join(__dirname, "storage/clips")));




// Middleware for handling 404 errors
app.use(notFound);
// Error-handling middleware
app.use(errorHandler);


app.listen(PORT, () => console.log(`Server running on port ${PORT}`))