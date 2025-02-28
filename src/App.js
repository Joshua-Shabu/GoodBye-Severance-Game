import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Certificate from './components/Certificate';
import Celebration from './components/Celebration';
import './styles/App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" exact element={<Certificate />} />
          <Route path="/celebration" element={<Celebration />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
