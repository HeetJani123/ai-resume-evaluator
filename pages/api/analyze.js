import fetch from 'node-fetch';

export default async function handler(req, res) {
  console.log('API endpoint called:', req.method, req.url);
  
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { text, jobTitle } = req.body;
  console.log('Request body:', { textLength: text?.length, jobTitle });

  if (!text) {
    console.log('No text provided in request');
    return res.status(400).json({ message: 'Text is required' });
  }

  if (!process.env.COHERE_API_KEY) {
    console.error('Cohere API key is not configured');
    return res.status(500).json({ message: 'Cohere API key is not configured. Please add COHERE_API_KEY to your environment variables.' });
  }

  // Extract only the resume content after 'Resume:'
  let resumeContent = text;
  const resumeIndex = text.indexOf('Resume:');
  if (resumeIndex !== -1) {
    resumeContent = text.substring(resumeIndex + 7).trim();
  }
  // Remove any line that starts with 'Note to model' (case-insensitive)
  resumeContent = resumeContent
    .split(/\r?\n/)
    .filter(line => !/^\s*note to model/i.test(line))
    .join('\n');

  // Truncate text to 3000 characters to avoid model context issues
  const maxLength = 3000;
  const truncatedText = resumeContent.length > maxLength 
    ? resumeContent.substring(0, maxLength) + '... [Content truncated for analysis]'
    : resumeContent;
  
  console.log('Text length after truncation:', truncatedText.length);

  try {
    console.log('Making request to Cohere API...');

    // Prompt for job match
    const matchPrompt = `You are an expert resume reviewer. Given the following resume and the target job title: "${jobTitle}", determine if the resume matches the job title. Respond with a match percentage (1-100%) and a brief explanation. Do not provide detailed feedback yet. Do not repeat this prompt or any part of it in your response.\n\nResume:\n${truncatedText}`;

    const matchResponse = await fetch('https://api.cohere.ai/v1/generate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.COHERE_API_KEY}`,
        'Content-Type': 'application/json',
        'Cohere-Version': '2022-12-06'
      },
      body: JSON.stringify({
        model: 'command',
        prompt: matchPrompt,
        max_tokens: 400,
        temperature: 0.3,
        k: 0,
        stop_sequences: [],
        return_likelihoods: 'NONE'
      }),
    });

    if (!matchResponse.ok) {
      const errorData = await matchResponse.json().catch(() => ({}));
      return res.status(matchResponse.status).json({ message: `Cohere API error: ${matchResponse.status} - ${JSON.stringify(errorData)}` });
    }
    const matchData = await matchResponse.json();
    let matchResult = '';
    if (matchData.generations && matchData.generations[0] && matchData.generations[0].text) {
      matchResult = matchData.generations[0].text;
    } else {
      matchResult = JSON.stringify(matchData);
    }
    // Remove any lines that repeat the prompt or start with 'You are an expert resume reviewer'
    matchResult = matchResult
      .split(/\r?\n/)
      .filter(line => !/^\s*you are an expert resume reviewer/i.test(line) && !/^\s*given the following resume/i.test(line) && !/^\s*respond with a match percentage/i.test(line) && !/^\s*do not provide detailed feedback yet/i.test(line) && !/^\s*resume:/i.test(line) && !/^\s*do not repeat this prompt/i.test(line))
      .join('\n')
      .trim();

    // Prompt for detailed feedback
    const feedbackPrompt = `You are a professional resume reviewer. Do NOT copy or repeat the resume text. Do NOT start with a generic introduction. For each line or section of the following resume, provide concise, actionable suggestions for improvement. Reference the specific line or section you are commenting on, but do not repeat the full text. Focus on clarity, impact, and relevance to the target job: ${jobTitle}. Only provide feedback and suggestions, not a summary or generic advice.\n\nResume:\n${truncatedText}\n\nFormat your response as a list of suggestions, each referencing the relevant line or section.`;

    const feedbackResponse = await fetch('https://api.cohere.ai/v1/generate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.COHERE_API_KEY}`,
        'Content-Type': 'application/json',
        'Cohere-Version': '2022-12-06'
      },
      body: JSON.stringify({
        model: 'command',
        prompt: feedbackPrompt,
        max_tokens: 800,
        temperature: 0.7,
        k: 0,
        stop_sequences: [],
        return_likelihoods: 'NONE'
      }),
    });

    if (!feedbackResponse.ok) {
      const errorData = await feedbackResponse.json().catch(() => ({}));
      return res.status(feedbackResponse.status).json({ message: `Cohere API error: ${feedbackResponse.status} - ${JSON.stringify(errorData)}` });
    }
    const feedbackData = await feedbackResponse.json();
    let feedback = '';
    if (feedbackData.generations && feedbackData.generations[0] && feedbackData.generations[0].text) {
      feedback = feedbackData.generations[0].text;
    } else {
      feedback = JSON.stringify(feedbackData);
    }

    res.status(200).json({ matchResult: matchResult.trim(), feedback: feedback.trim() });
  } catch (error) {
    console.error('Error calling Cohere API:', error);
    res.status(500).json({ message: `Error analyzing resume: ${error.message}` });
  }
} 