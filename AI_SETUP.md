# AI Assistant Setup Instructions

## 🤖 Setting up Claude AI Integration

### 1. Get Your Anthropic API Key
1. Go to [https://console.anthropic.com/](https://console.anthropic.com/)
2. Sign up or log in to your account
3. Navigate to "API Keys" section
4. Create a new API key
5. Copy the API key (starts with `sk-ant-`)

### 2. Add API Key to Environment
1. Open your `.env.local` file (create if it doesn't exist)
2. Add this line:
```
ANTHROPIC_API_KEY=your_actual_api_key_here
```
3. Replace `your_actual_api_key_here` with your real API key
4. Save the file

### 3. Restart Your Development Server
```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

### 4. Test the AI Assistant
1. Click "AI Assistant" in the sidebar
2. Try asking: "Which regions have the most renewable energy projects?"
3. The AI should respond with insights about your data

## 🎯 Example Questions to Try

- "What's the success rate for offshore wind projects?"
- "Compare solar vs wind energy development"
- "Which technology has the fastest approval process?"
- "Show me investment opportunities in Scotland"
- "What are the trends in renewable energy capacity?"

## 🔧 Troubleshooting

### "AI service not configured" error
- Check that your `.env.local` file exists
- Verify the API key is correct
- Make sure you restarted the development server

### "Invalid API key" error
- Double-check your API key from Anthropic console
- Ensure no extra spaces in the `.env.local` file

### Rate limit errors
- You're making too many requests
- Wait a moment and try again
- Consider upgrading your Anthropic plan for higher limits

## 💰 API Costs
- Claude AI charges per token (input + output)
- Typical question costs ~$0.01-0.05
- Monitor usage in Anthropic console
- Implement usage limits in production

## 🚀 Ready to Use!
Once configured, your AI Assistant can analyze your 13,000+ renewable energy projects and provide intelligent business insights!
