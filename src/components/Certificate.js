import React, { useState } from 'react';
import Celebration from './Celebration';
import './Certificate.css';

function Certificate() {
  const [name, setName] = useState('');
  const [showCelebration, setShowCelebration] = useState(false);

  const handleGenerate = () => {
    setShowCelebration(true);
  };

  return (
    <div className="certificate-wrapper">
      {!showCelebration ? (
        <>
          <h1>Enjoy entering each letter of your first name equally</h1>
          <input
            type="text"
            placeholder="Enter your first name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button onClick={handleGenerate} disabled={!name}>
            integrate
          </button>
        </>
      ) : (
        <Celebration name={name} />
      )}
    </div>
  );
}

export default Certificate;
