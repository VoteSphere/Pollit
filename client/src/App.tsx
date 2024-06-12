import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreatePollPage from './features/create-poll/CreatePollPage';
import './styles/index.css';

const App: React.FC = () => (
  <Router>
    <Routes>
      <Route path='/' element={<CreatePollPage />} />
    </Routes>
  </Router>
);

export default App;
