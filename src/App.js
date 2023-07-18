import React, { useState } from 'react';
// import { FiSearch, FiChevronDown } from 'react-icons/fi';
import './styles.css';
import Login from './Login.js';

// Mock API for testing purposes
// import feedbackApi from './services/feedbackAPI';
// import lastProductsAPI from './services/lastProductsAPI';
// import authenticateAPI from './services/authenticateAPI';

function App() {
  const [token, setToken] = useState('');

  // Render the login page if token does not exist
  if (!token) {
    return <Login setToken={setToken} />;
  }

  // Render the main application content
  return (
    <div className="mainContainer">
      {/* Add your main application code here */}
    </div>
  );
}

export default App;

