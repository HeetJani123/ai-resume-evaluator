import React, { useState, useRef, useCallback } from 'react';
import { extractTextFromPdf } from '../utils/pdfUtils';
import styles from '../styles/Home.module.css';

const PdfUploader = ({ onFeedback }) => {
  const [file, setFile] = useState(null);
  const [jobTitle, setJobTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const [extractedText, setExtractedText] = useState('');

  const handleFile = useCallback(async (selectedFile) => {
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError('');
      setIsLoading(true);
      try {
        const text = await extractTextFromPdf(selectedFile);
        const experienceMatch = text.match(/Experience:(.*?)(?:\\n[A-Z ]+:|$)/is);
        const experienceSection = experienceMatch ? experienceMatch[1].trim() : text;
        setExtractedText(experienceSection);
        setError('');
      } catch (err) {
        setError(err.message || 'Error processing PDF. Please try again.');
        setExtractedText('');
        console.error('Error:', err);
      } finally {
        setIsLoading(false);
      }
    } else {
      setError('Please upload a valid PDF file.');
      setExtractedText('');
    }
  }, []);

  const onFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      handleFile(selectedFile);
    }
  };

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const onDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFile(droppedFile);
    }
  }, [handleFile]);

  const handleDragDropClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async () => {
    if (!extractedText) {
      setError('No text extracted from PDF.');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: extractedText, jobTitle }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error analyzing resume.');
      }
      const data = await response.json();
      onFeedback(data);
    } catch (error) {
      setError(error.message || 'Error analyzing resume.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.uploadSection}>
      <h2 className={styles.uploadTitle}>Upload Your Resume</h2>
      
      <div 
        className={`${styles.dragDropArea} ${isDragOver ? styles.dragover : ''}`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={handleDragDropClick}
      >
        <span className={styles.dragDropIcon}>📄</span>
        <div className={styles.dragDropText}>
          {isDragOver ? 'Drop your PDF here' : 'Drag & drop your PDF here'}
        </div>
        <div className={styles.dragDropSubtext}>
          or click to browse files
        </div>
        <input 
          ref={fileInputRef}
          type="file" 
          onChange={onFileChange} 
          accept=".pdf" 
          className={styles.fileInput}
        />
      </div>
      
      <div className={styles.jobTitleSection}>
        <label className={styles.jobTitleLabel}>
          Target Job Title (Optional)
        </label>
        <input
          type="text"
          placeholder="e.g., Software Engineer, Marketing Manager"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          className={styles.jobTitleInput}
        />
      </div>
      
      <button
        className={styles.submitButton}
        onClick={handleSubmit}
        disabled={isLoading || !file || !extractedText}
      >
        {isLoading ? 'Analyzing...' : 'Submit'}
      </button>
      
      {error && (
        <div className={styles.error}>
          <span className={styles.errorIcon}>⚠️</span>
          {error}
        </div>
      )}
      
      {file && (
        <div className={styles.pdfPreview}>
          <div style={{ padding: '1rem', textAlign: 'center', color: '#666' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📄</div>
            <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{file.name}</div>
            <div style={{ fontSize: '0.9rem' }}>
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </div>
          </div>
        </div>
      )}
      {extractedText && (
        <div style={{ marginTop: '1.5rem', background: '#f9f9f9', border: '1px solid #eee', borderRadius: '6px', padding: '1rem' }}>
          <h3 style={{ marginBottom: '0.5rem', fontSize: '1rem', color: '#333' }}>Extracted Resume Text (Debug)</h3>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: '0.95rem', color: '#444', maxHeight: '300px', overflowY: 'auto' }}>{extractedText}</pre>
        </div>
      )}
    </div>
  );
};

export default PdfUploader; 