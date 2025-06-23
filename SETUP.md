# Setup Guide for AI Resume Evaluator

## 1. Get Your OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the API key (starts with `sk-`)

## 2. Create Environment File

Create a file called `.env.local` in the root directory of this project with the following content:

```
OPENAI_API_KEY=sk-your-actual-api-key-here
```

Replace `sk-your-actual-api-key-here` with your actual OpenAI API key.

## 3. Restart the Development Server

After creating the `.env.local` file, restart your development server:

```bash
npm run dev
```

## 4. Test the Application

1. Open your browser to `http://localhost:3000`
2. Upload a PDF resume
3. The AI should now analyze your resume and provide feedback

## Troubleshooting

- **500 Error**: Make sure your API key is correct and the `.env.local` file is in the right location
- **401 Error**: Your API key is invalid or expired
- **429 Error**: You've exceeded your OpenAI rate limit

## File Structure

Your project should look like this:
```
ai-resume-evaluator/
├── .env.local          ← Create this file
├── pages/
├── components/
├── styles/
└── ...
``` 