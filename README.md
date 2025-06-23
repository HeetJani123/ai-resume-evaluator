# AI Resume Evaluator

This project uses Next.js, OpenAI, and React-PDF to evaluate resumes. Upload a PDF, and get AI-powered feedback on strengths, improvements, and matching percentage.

## Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd ai-resume-evaluator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

- Upload PDF resumes via drag-and-drop
- Preview PDFs in-browser
- Extract text from PDFs
- Send content to OpenAI for analysis
- Display AI feedback in a clean, mobile-friendly panel
- Optional job title input for tailored feedback

## Technologies Used

- Next.js
- OpenAI API
- React-PDF / PDF.js
- Axios

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
