import mongoose from "mongoose";

const postAnalysisDataSchema = new mongoose.Schema({
        userId: {type: String, required: true, index: true},
        timestamp: {type: Date, default: Date.now},
        testConfig: {
            language: String,
            timeLimit: Number,
        },
        macroscopicMetrics: {
            wpm: Number,
            accuracy: Number
        },
        microscopicMetrics: {
            totalHesitationTimeMs: Number,
            problemKeys: Map,
            missedKeys: Map
        }
});

const session = mongoose.model("PostAnalysisData", postAnalysisDataSchema);

export default session;