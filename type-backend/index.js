import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import session from './Models/postAnalysisData.js'
import dotenv from 'dotenv'
import User from './Models/User.js'
import { OAuth2Client } from 'google-auth-library'
import jwt from 'jsonwebtoken'


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

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})