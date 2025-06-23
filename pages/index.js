import Head from 'next/head';
import styles from '../styles/Home.module.css';
import dynamic from 'next/dynamic';
import InsightsPanel from '../components/InsightsPanel';
import { useState } from 'react';

const PdfUploader = dynamic(() => import('../components/PdfUploader'), { ssr: false });

export default function Home() {
  const [feedback, setFeedback] = useState(null);
  const [matchResult, setMatchResult] = useState(null);

  const handleFeedback = (data) => {
    setFeedback(data.feedback);
    setMatchResult(data.matchResult);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>AI Resume Evaluator</title>
        <meta name="description" content="Upload your resume for AI-powered feedback" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>AI Resume Evaluator</h1>
          <p className={styles.subtitle}>Professional Resume Analysis</p>
          <p className={styles.description}>
            Get instant AI-powered feedback on your resume. Upload your PDF and receive personalized insights, 
            improvement suggestions, and matching percentage for your target role.
          </p>
        </div>

        <div className={styles.content}>
          <PdfUploader onFeedback={handleFeedback} />
          <InsightsPanel matchResult={matchResult} feedback={feedback} />
        </div>
      </main>

      <footer className={styles.footer}>
        <p>Powered by Next.js and OpenAI</p>
      </footer>
    </div>
  );
} 