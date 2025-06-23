export default function handler(req, res) {
  res.status(200).json({ 
    message: 'API is working',
    hasApiKey: !!process.env.OPENAI_API_KEY,
    apiKeyPrefix: process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.substring(0, 10) + '...' : 'Not set',
    isPlaceholder: process.env.OPENAI_API_KEY === 'your_openai_api_key_here'
  });
} 