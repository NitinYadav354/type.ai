import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import session from './Models/postAnalysisData.js'
import dotenv from 'dotenv'
import User from './Models/User.js'
import { OAuth2Client } from 'google-auth-library'
import jwt from 'jsonwebtoken'
import { GoogleGenAI, Type} from '@google/genai';


dotenv.config()

const app = express()
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}))
app.use(express.text({ type: ['text/plain', 'text/*'] }))
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

const ai = new GoogleGenAI({apiKey: process.env.GOOGLE_API_KEY});

const ANALYSIS_MODELS = ['gemini-3.5-flash','gemini-3.1-flash-lite', 'gemini-2.5-flash']

const typingAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        headline:       { type: Type.STRING },
        strengths:      { type: Type.ARRAY,  items: { type: Type.STRING }, minItems: 1, maxItems: 2 },
        weaknesses:     { type: Type.ARRAY,  items: { type: Type.STRING }, minItems: 1, maxItems: 2 },
        insights:       { type: Type.ARRAY,  items: { type: Type.STRING }, minItems: 1, maxItems: 2 },
        focus:          { type: Type.STRING },
        practicePrompt: { type: Type.STRING }
    },
    required: ["headline", "strengths", "weaknesses", "insights", "focus", "practicePrompt"]
        }

const COACH_SYSTEM_INSTRUCTION = `You are an expert in motor learning, typing performance, and behavioral pattern analysis.
You are analyzing a typing test session.

Important context:
* The user is copying text displayed on screen — no composition or recall.
* Delays reflect typing behavior: visual processing, motor execution, rhythm, and error detection.
* Backspace events are intentional corrections. All errors are eventually corrected.
* The user already sees WPM, Net WPM, Accuracy, and a character-level speed heatmap. Do NOT repeat or summarize information that is already obvious from them.
* Data schema: array of events.
  {"c","t"} = correct keystroke (char, ms since last keystroke).
  {"c","x","t"} = error (c = typed, x = expected, ms).
  {"b","t"} = backspace (ms since last event).

Internally reason across all of the following before writing your response:
- Rhythm and cadence: bursts, deceleration, acceleration
- Flow: smooth sections vs momentum breaks
- Error behavior: correction style, recovery speed, hesitation patterns
- Consistency: timing stability and anomalous slow actions
- Difficult character transitions or repeated hesitation patterns
- The dominant performance bottleneck
- Any meaningful relationship between observations that is not immediately obvious from WPM, Accuracy, or the heatmap

Reasoning rules:
- Base every conclusion only on observable typing behavior.
- Do NOT infer confidence, emotions, attention, intent, personality, or thoughts.
- Every strength, bottleneck, and recommendation must be supported by repeated evidence in the data.
- Avoid observations that could apply to most typists.
- If evidence is weak, omit the observation rather than speculate.
- Prefer connecting multiple observations into one useful insight instead of listing isolated facts.

Output instructions:
- Write for a non-technical user. No jargon. Plain English.
- Explain the session, not the heatmap.
- Translate technical observations into relatable language.
- The reponse should include evidence.

BAD:
"bilateral asymmetry in inter-keystroke intervals"

GOOD:
"your right hand consistently slows down more than your left"

BAD:
"cognitive reset during lexical boundary transitions"

GOOD:
"your rhythm repeatedly breaks before longer words"

BAD:
"you anticipate the next word"

GOOD:
"you often move into the next word without slowing down"

headline:
- One punchy sentence.
- The defining characteristic of this session.
- Maximum 20 words.
- Should sound like something a coach would say, not a report.

strengths:
- 1-2 evidence-backed behaviors that consistently helped performance.
- Explain briefly why.
- Maximum 30 words each.

weaknesses:
- 1-2 highest-impact patterns limiting performance.
- Prioritize the biggest bottleneck instead of listing every weakness.
- Maximum 30 words each.

focus:
- The single most important coaching recommendation.
- Concrete and specific.
- Maximum 25 words.

practicePrompt:
- Comma-separated text characteristics only.
- Describe text that stresses the identified bottleneck.
- No sentences.
- No typing advice.
- No behavior instructions ("fast", "smooth").
- Describe the text, not how to type it.

Example:
"frequent hyphens, words starting with w and d, mix of short and long words, back-to-back pairs like 'to do', 'the way'`


const PRACTICE_SYSTEM_INSTRUCTION = `Generate a 30-word typing practice passage using
natural, readable sentences. Do not explain or label anything -
only output the passage itself. Never use double spaces. The passage must include: `

app.post('/api/coach', async (req, res) => {
    console.log("Received coaching request")
    const events = req.body
    let lastErr = null

    for (const model of ANALYSIS_MODELS) {
        try {
            const response = await ai.models.generateContent({
                model,
                contents: JSON.stringify(events, null, 0),
                config: {
                    temperature: 0.1,
                    topP: 0.2,
                    topK: 10,
                    systemInstruction: COACH_SYSTEM_INSTRUCTION,
                    responseMimeType: "application/json",
                    responseSchema: typingAnalysisSchema,
                    ...(model === 'gemini-2.5-flash' ?{
                        thinkingConfig: {
                            includeThoughts: true,
                            thinkingBudget: 1024
                        }
                        
                    }
                    : {
                        thinkingConfig: {
                            thinkingLevel: "MEDIUM"
                        }
                    })
                }
            });

            const analysisData = JSON.parse(response.text)
            const metadata = response.usageMetadata;
            const modelUsed = response.modelVersion;
            const thinkingTokens = metadata.thoughtsTokenCount || 0;
            const wasThinkingEnabled = thinkingTokens > 0;
            console.log("AI Coaching response:", analysisData)
            console.log("AI Coaching metadata:", metadata)
            console.log(`Model used: ${modelUsed}, Thinking enabled: ${wasThinkingEnabled}, Thinking tokens: ${thinkingTokens}`)

            return res.status(200).json(analysisData);
        }
        catch (err) {
            console.warn(`/api/coach: ${model} failed - ${err.message}`)
            lastErr = err
        }
    }

    console.error("Error generating coaching feedback:", lastErr)
    res.status(500).json({ error: 'Internal Server Error' })
})

app.post('/api/coach/practice-text', async (req, res) => {
    console.log("Received practice text request")
    try {
        const { practicePrompt } = req.body
        if (!practicePrompt) {
            return res.status(400).json({ error: 'practicePrompt is required' })
        }

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-lite",
            contents: practicePrompt,
            config: {
                systemInstruction: PRACTICE_SYSTEM_INSTRUCTION
            }
        });

        const practiceText = response.text.trim()
        const modelUsed = response.modelVersion;
        console.log("Generated practice text:", practiceText)
        console.log(`Model used: ${modelUsed}, Thinking enabled: false`)

        return res.status(200).json({ practiceText });
    }
    catch (err) {
        console.error("Error generating practice text:", err)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})