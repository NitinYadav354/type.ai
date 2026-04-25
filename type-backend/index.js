import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import session from './Models/postAnalysisData.js'

const app = express()
app.use(cors())
app.use(express.json())

//connect to MongoDB

const MONGO_URI = process.env.MONGO_URI
mongoose.connect(MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Error connecting to MongoDB:", err))

// Define routes
app.post('/api/session', async (req, res) => {
    try {
        const sessionData = req.body
        console.log("Received session data:", sessionData)
        const newSession = new session(sessionData)
        await newSession.save()
        res.status(201).json({ message: 'Session data saved successfully' })
    }
    catch (err) {
        console.error("Error processing session data:", err)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})