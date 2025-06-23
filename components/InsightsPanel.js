import React, { useState } from 'react';
import styles from '../styles/Home.module.css';

const InsightsPanel = ({ matchResult, feedback }) => {
  const [showFeedback, setShowFeedback] = useState(false);

  if (!matchResult) {
    return (
      <div className={styles.insightsPanel}>
        <div className={styles.emptyState}>
          <div className={styles.emptyStateIcon}>💡</div>
          <div className={styles.emptyStateText}>AI Insights</div>
          <div className={styles.emptyStateSubtext}>
            Upload your resume to get personalized feedback and recommendations
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.insightsPanel}>
      <h2>AI Job Match</h2>
      <div className={styles.feedbackContent}>
        {matchResult}
      </div>
      {!showFeedback && feedback && (
        <button className={styles.showFeedbackButton} onClick={() => setShowFeedback(true)}>
          Show AI Feedback
        </button>
      )}
      {showFeedback && feedback && (
        <>
          <h3>Detailed AI Feedback</h3>
          <div className={styles.feedbackContent}>{feedback}</div>
        </>
      )}
    </div>
  );
};

export default InsightsPanel; 