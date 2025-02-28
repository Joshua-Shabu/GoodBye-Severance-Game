import React, { useEffect } from 'react';
import './Farewell.css';

const Farewell = () => {
  useEffect(() => {
    const farewellLines = [
      "Goodbye, Josh.",
      "For the last three years, I was working at CCS Technologies Pvt Ltd.",
      "It was a great journey filled with challenges and learning.",
      "I met wonderful people and worked on amazing projects.",
      "But now, it's time to move forward to new adventures.",
      "Thank you for everything!",
      "See you soon!",
    ];

    let index = 0;

    function speakText(text) {
      let speech = new SpeechSynthesisUtterance(text);
      speech.lang = "en-US"; // Set language
      speech.rate = 1; // Set speech speed
      window.speechSynthesis.speak(speech);
    }

    function showNextLine() {
      if (index < farewellLines.length) {
        let messageDiv = document.getElementById("message");
        messageDiv.innerHTML += `<p>${farewellLines[index]}</p>`; // Add next line
        speakText(farewellLines[index]); // AI Voice narration
        index++;
        setTimeout(showNextLine, 3000); // Show next line after 3 seconds
      }
    }

    setTimeout(showNextLine, 2000); // Start showing messages after 2 sec
  }, []);

  return (
    <div className="farewell-wrapper">
      <h1>Goodbye, Josh</h1>
      <div id="message"></div>
    </div>
  );
};

export default Farewell;