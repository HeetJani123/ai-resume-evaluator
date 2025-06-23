export default function TestPage() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>Test Page</h1>
      <p>If you can see this, Next.js is working properly.</p>
      <p>Current time: {new Date().toLocaleString()}</p>
    </div>
  );
} 