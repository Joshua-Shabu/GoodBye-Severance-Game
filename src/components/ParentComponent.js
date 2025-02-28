import React, { useState } from 'react';
import Celebration from './Celebration';

const ParentComponent = () => {
  const [showCelebration, setShowCelebration] = useState(true);

  const handleReset = () => {
    setShowCelebration(false);
    // Additional reset logic if needed
  };

  return (
    <div>
      {showCelebration && <Celebration name="John Doe" onReset={handleReset} />}
      {!showCelebration && (
        <div>
          <h1>Enter your name to start the celebration</h1>
          {/* Input form or other components */}
        </div>
      )}
    </div>
  );
};

export default ParentComponent;