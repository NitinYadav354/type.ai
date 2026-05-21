import axios from 'axios';
import {getOrCreateGuestID} from '../Utility/userGuestID'

const TELEMETRY_ENDPOINT = 'http://localhost:3000/api/session';

export async function sendTelemetry(metrics: any) {

    const {TimeTaken, wpm, accuracy, hesitationTimesec, hesitationMap, missedKeysMap} = metrics
    const payload = {
        userId: getOrCreateGuestID(),
        timestamp: new Date().toISOString(),
        testConfig: {
            language: "english",
            timeLimit: TimeTaken,
        },
        macroscopicMetrics: {
            wpm: Math.round(wpm),
            accuracy: Math.round(accuracy)
        },
        microscopicMetrics: {
            totalHesitationTimeMs: Math.round(hesitationTimesec * 1000),
            problemKeys: hesitationMap,
            missedKeys: missedKeysMap
        }
    };
    try {
        const response = await axios.post(TELEMETRY_ENDPOINT, payload);
        return response.data;
    } catch (error) {
        console.error('Error sending telemetry:', error);
        throw error;
    }
}