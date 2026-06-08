import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import session from './Models/postAnalysisData.js'
import dotenv from 'dotenv'
import User from './Models/User.js'
import { OAuth2Client } from 'google-auth-library'
import jwt from 'jsonwebtoken'
import {GoogleGenerativeAI} from '@google/generative-ai'


dotenv.config()

const app = express()
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}))
app.use(express.json())

//connect to MongoDB

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const JWT_SECRET = process.env.JWT_SECRET

const client = new OAuth2Client(GOOGLE_CLIENT_ID)

app.post('/api/auth/google', async (req, res) => {
    try {
        const {token, guestID } = req.body
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: GOOGLE_CLIENT_ID
        })
        const payload = ticket.getPayload()

        let user = await User.findOne({ googleId: payload.sub })
        if (!user) {
            user = new User({
                googleId: payload.sub,
                email: payload.email,
                name: payload.name,
                profilePicture: payload.picture
            })
            await user.save()
        }

        if (guestID && guestID.startsWith("guest_")) {
            const updateResult = await session.updateMany(
                { userId: guestID },
                { $set: { userId: user.googleId } }
            )
            console.log(`Updated ${updateResult.modifiedCount} session(s) from guestID ${guestID} to userId ${user.googleId}`)
        }

        const sessionToken = jwt.sign({ userId: user.googleId }, JWT_SECRET, { expiresIn: '7d' })

        res.status(200).json({ token: sessionToken, user: { name: user.name, email: user.email, profilePicture: user.profilePicture } })
    }
        catch (err) {
        console.error("Error during Google authentication:", err)
        res.status(500).json({ error: 'Internal Server Error' })
        }
    })


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

app.get('/ping', (req, res) => {
    res.status(200).send('pong')
})

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY)
app.post('/api/coach', async (req, res) => {
    try {
        const { actualChars, expectedChars, time_taken } = req.body
        console.log("Received coaching request with data:", { actualChars, expectedChars, time_taken })
        const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });
        const prompt = `You are an expert, encouraging typing coach for an app called Type.AI. 
      Analyze the following user typing session data:
      typed text ${JSON.stringify(actualChars)}
      expected text ${JSON.stringify(expectedChars)}
      time taken ${JSON.stringify(time_taken)}
      
      Instructions:
      1. Write exactly 2 or 3 short sentences.
      2. Be highly specific about the keys they struggled with.
      3. Give one practical, physical piece of advice on how to improve those specific keys.
      4. Speak directly to the user (e.g., "I noticed you...").
      5. Do not use markdown formatting like bolding or asterisks.`
      
        const response = await model.generateContent(prompt)
        res.status(200).json({ feedback: response })
    }
    catch (err) {
        console.error("Error generating coaching feedback:", err)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})