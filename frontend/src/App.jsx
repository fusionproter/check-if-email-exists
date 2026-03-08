import { useState } from 'react';
import './App.css';
import SingleValidation from './components/SingleValidation';
import BulkValidation from './components/BulkValidation';

function App() {
  const [activeTab, setActiveTab] = useState('bulk');

  return (
    <div className="app">
      <header className="header">
        <div className="container">
          <h1 className="logo">Email Validator</h1>
          <p className="tagline">Verify email addresses for accuracy and deliverability</p>
        </div>
      </header>

      <main className="main">
        <div className="container">
          <div className="tabs">
            <button
              className={`tab ${activeTab === 'bulk' ? 'active' : ''}`}
              onClick={() => setActiveTab('bulk')}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zM3 16a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" />
              </svg>
              Bulk Validation
            </button>
            <button
              className={`tab ${activeTab === 'single' ? 'active' : ''}`}
              onClick={() => setActiveTab('single')}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              Single Validation
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'single' && <SingleValidation />}
            {activeTab === 'bulk' && <BulkValidation />}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
