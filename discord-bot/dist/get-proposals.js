"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProposalsFromAPI = getProposalsFromAPI;
const node_fetch_1 = __importDefault(require("node-fetch"));
const API_URL = process.env.API_URL;
/**
 * Fetch proposals from the Next.js API
 */
async function getProposalsFromAPI() {
    if (!API_URL)
        throw new Error('Missing API_URL in environment variables');
    const res = await (0, node_fetch_1.default)(API_URL);
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to fetch proposals: ${res.status} ${text}`);
    }
    const data = (await res.json());
    if (data.status !== 'ok') {
        throw new Error(`API responded with error: ${data.message}`);
    }
    if (!Array.isArray(data.message)) {
        throw new Error('Unexpected API response format');
    }
    return data.message;
}
