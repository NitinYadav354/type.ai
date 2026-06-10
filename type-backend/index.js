import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import session from './Models/postAnalysisData.js'
import dotenv from 'dotenv'
import User from './Models/User.js'
import { OAuth2Client } from 'google-auth-library'
import jwt from 'jsonwebtoken'
import { GoogleGenAI, Type } from '@google/genai';


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


// const MONGO_URI = process.env.MONGO_URI
// mongoose.connect(MONGO_URI)
//     .then(() => console.log("Connected to MongoDB"))
//     .catch((err) => console.error("Error connecting to MongoDB:", err))

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

const ai = new GoogleGenAI({apiKey: process.env.GOOGLE_API_KEY});

const typingAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        overall_assessment: { type: Type.STRING },
        rhythm_profile: { type: Type.STRING },
        consistency_assessment: { type: Type.STRING },
        flow_analysis: {
            type: Type.OBJECT,
            properties: {
                strong_flow_regions: { type: Type.ARRAY, items: { type: Type.STRING } },
                flow_breaks: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
        },
        error_behavior: {
            type: Type.OBJECT,
            properties: {
                correction_style: { type: Type.STRING },
                recovery_efficiency: { type: Type.STRING },
                notable_patterns: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
        },
        confidence_analysis: {
            type: Type.OBJECT,
            properties: {
                high_confidence_regions: { type: Type.ARRAY, items: { type: Type.STRING } },
                low_confidence_regions: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
        },
        timing_patterns: {
            type: Type.OBJECT,
            properties: {
                unusual_delays: { type: Type.ARRAY, items: { type: Type.STRING } },
                repeated_slowdowns: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
        },
        character_difficulty_patterns: { type: Type.ARRAY, items: { type: Type.STRING } },
        hidden_insights: { type: Type.ARRAY, items: { type: Type.STRING } },
        strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
        weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
        coaching_recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
        session_summary: { type: Type.STRING }
    }
};

app.post('/api/coach', async (req, res) => {
    try {
        const { type, expectedChar ,actualChar, timeStamp, isCorrect  } = req.body
        const response = await ai.models.generateContent({
            model: "gemma-4-26b-a4b-it",
            contents:
            `
                type: ${type}
                actualChar: ${JSON.stringify(actualChar)}
                expectedChar: ${JSON.stringify(expectedChar)}
                timeStamp: ${JSON.stringify(timeStamp)}
                isCorrect: ${JSON.stringify(isCorrect)}
            `,
            config: {
                thinkingConfig: {
                    includeThoughts: true,
                    thinkingBudget: 0
                },
                temperature: 0.1,
                systemInstruction: `You are an expert in motor learning, typing performance, human-computer interaction, and behavioral pattern analysis.
                You are analyzing a typing test session.
                
                Important context:
                * The user is copying text displayed on the screen.
                * The user is not composing thoughts, recalling information, or creating content.
                * Assume no tab switching, notifications, multitasking, or external distractions.
                * Delays should be interpreted primarily as typing behavior, visual processing, motor execution, rhythm changes, error detection, or correction behavior.
                * Backspace events represent intentional corrections.
                * The user must finish the test with zero final errors, so all errors are eventually corrected.
                
                Your goal is NOT to focus on basic metrics such as WPM or accuracy.
                Instead, perform a deep behavioral analysis of the typing session.
                
                Analyze the following:
                1. Rhythm Analysis: Describe overall rhythm, bursts, cadence, acceleration/deceleration.
                2. Flow Analysis: Identify automatic sections and momentum breaks, explaining triggers.
                3. Error Behavior: Analyze correction sequences (immediate/delayed), recovery efficiency, and hesitation.
                4. Consistency Analysis: Measure timing stability and identify unusual/recurring slow actions.
                5. Character and Transition Difficulty: Detect difficult characters, weak patterns, and awkward movements.
                6. Confidence Indicators: Identify high/low confidence regions based on timing/corrections.
                7. Correction Intelligence: Evaluate self-monitoring, error detection speed, and correction precision.
                8. Hidden Behavioral Insights: Identify non-obvious patterns an expert coach would notice.
                9. Personalized Coaching: List top strengths, weaknesses, and prioritized concrete recommendations.
                10. Session Summary: Write a concise, insightful profile.
                
                Requirements:
                * Do not mention WPM unless necessary.
                * Do not simply describe the data; explain reasoning behind conclusions.
                * Focus on actionable observations.
                * Distinguish between strong and weak evidence.
                * Avoid generic typing advice.`,
                
                responseMimeType: "application/json"
            }
        });

        const analysisData = JSON.parse(response.text);
        const metadata = response.usageMetadata;
        const modelUsed = response.modelVersion;
        const thinkingTokens = metadata.thoughtsTokenCount || 0;
        const wasThinkingEnabled = thinkingTokens > 0;

        console.log("Prompt Tokens:", metadata.promptTokenCount);
        console.log("Output Tokens:", metadata.candidatesTokenCount);
        console.log("Total Tokens:", metadata.totalTokenCount);
        console.log("Model Used:", modelUsed);
        console.log("Thinking Enabled:", wasThinkingEnabled);

        return res.status(200).json({ 
            feedback: analysisData,
            usage: {
                promptTokens: metadata.promptTokenCount,
                completionTokens: metadata.candidatesTokenCount,
                totalTokens: metadata.totalTokenCount,
                modelUsed: modelUsed,
                thinkingEnabled: wasThinkingEnabled,
                thinkingTokens: thinkingTokens
            }
        });
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