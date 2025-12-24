import api from './api';

/**
 * Chat with Ema via the backend server to avoid browser quota limits.
 * The backend handles calling the Gemini API with the persistent API key.
 */
export const chatWithEma = async (message, history = []) => {
    try {
        console.log("🔌 Ema: Sending message to backend server...");

        // Format history for the backend
        const formattedHistory = history.slice(-5).map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            text: msg.text
        }));

        // Call the backend API
        const response = await api.post('/api/v1/ai/chat', {
            message,
            history: formattedHistory
        });

        if (response.data && response.data.response) {
            console.log("✅ Ema: Response received from server!");
            return response.data.response;
        }

        throw new Error("Empty response from AI server");

    } catch (error) {
        console.error("❌ Ema Service Error:", error);

        // Check for common error patterns from our backend or axios
        const errorMsg = error.response?.data?.message || error.message || "";

        if (errorMsg.includes("429") || errorMsg.includes("quota")) {
            return "Our AI server is receiving too many requests right now! 📈 Please wait a moment while I catch my breath. Try sending your message again! ✨";
        }

        // Fallback for any other error
        return "I'm having a little trouble connecting to my AI brain through the server. 🧠 Please try asking me again in a few seconds! 😊";
    }
};
