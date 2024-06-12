import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreatePollPage from './features/create-poll/CreatePollPage';
import VoterPage from './features/voter-page/VoterPage';
import './styles/index.css';

const App: React.FC = () => (
  <Router>
    <Routes>
      <Route path='/' element={<CreatePollPage />} />
      <Route path='/p/:pollId' element={<VoterPage />} />
    </Routes>
  </Router>
);

export default App;
