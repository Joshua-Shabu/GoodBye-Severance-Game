import React, { useEffect, useState } from "react";
import { useSpring, animated, config } from "@react-spring/web";
import generateCertificate from "../utils/generateCertificate"; // Import generateCertificate
import "./Celebration.css";

const GRID_SIZE = 40;
const ROW_SIZE = 20;
const NUM_CONTAINERS = 5;
const MESSAGE_TEMPLATE =
  "Goodbye, {name}. Working with you has been a true pleasure. Wishing you all the best ahead!";
const RANDOM_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const RADIUS = 100;
let wordInstanceCounter = 0; // To track each unique instance of a word

const Celebration = ({ name, onReset }) => {
  const formattedMessage = MESSAGE_TEMPLATE.replace("{name}", name).split(" ");
  const totalWords = formattedMessage.length;
  
  const [grid, setGrid] = useState([]);
  const [activeContainer, setActiveContainer] = useState(null);
  const [draggedWord, setDraggedWord] = useState(null);
  const [containersContent, setContainersContent] = useState(
    Array(NUM_CONTAINERS).fill([])
  );
  const [historyState, setHistory] = useState([]); // Renamed to historyState
  const [future, setFuture] = useState([]);
  const [selectedWords, setSelectedWords] = useState([]);
  const [hoverCounts, setHoverCounts] = useState({});
  const [showPopup, setShowPopup] = useState(false); // Add state for popup
  const [wordsDragged, setWordsDragged] = useState(0); // Ensure this is declared before useEffect
  
  // const hoverAudio = new Audio("/assets/audio/mixkit-arcade-retro-game-over-213.wav");
  // const dragAudio = new Audio("/assets/audio/mixkit-arrow-whoosh-1491.wav");
  const lidOpenAudio = new Audio("/assets/audio/mixkit-fast-small-sweep-transition-166.wav");
  const wordPlacedAudio = new Audio("/assets/audio/mixkit-retro-game-notification-212.wav");
  const congratsAudio = new Audio("/assets/audio/AUDIO-2025-02-28-21-52-08.mp3");

  const handleContainerMouseEnter = (index) => {
    setActiveContainer(index);
    lidOpenAudio.play();
  };
  const handleContainerMouseLeave = () => setActiveContainer(null);
  
  // Track hovered words to open corresponding bin
  useEffect(() => {
    const activeWordIndex = Object.entries(hoverCounts).find(
      ([_, count]) => count > 0
    )?.[0];
    setActiveContainer(activeWordIndex ? activeWordIndex % NUM_CONTAINERS : null);
  }, [hoverCounts]);

  // Spring animations
  const [springs, api] = useSpring(() => ({
    from: { x: 0, y: 0 },
    config: config.wobbly,
  }));

  // Spring for container highlight
  const [containerSprings] = useSpring(() => ({
    from: { scale: 1 },
    to: { scale: activeContainer !== null ? 1.1 : 1 },
    config: config.stiff,
  }));

  // Replace the useEffect call with:
  useEffect(() => {
    generateGridWithMessage();
  }, []);

  const handleWordSelect = (word) => {
    if (!selectedWords.includes(word)) {
      setSelectedWords([...selectedWords, word]);
    }
  };

  // Generate grid with message words embedded
  const generateGridWithMessage = () => {
    const letterGrid = Array(ROW_SIZE * GRID_SIZE).fill(null);
    let currentRow = 0;

    formattedMessage.forEach((word, wordIndex) => {
      if (currentRow >= ROW_SIZE) return;
      const colStart = Math.floor(Math.random() * (GRID_SIZE - word.length));
      
      for (let i = 0; i < word.length; i++) {
        const index = currentRow * GRID_SIZE + colStart + i;
        letterGrid[index] = {
          letter: word[i],
          isMessage: true,
          wordIndex: wordIndex,
          wordInstanceId: wordInstanceCounter, // Unique ID for the instance
          originalPos: index,
          x: (colStart + i) * 35,
          y: currentRow * 35
        };
      }
      currentRow++;
      wordInstanceCounter++;
    });

    for (let i = 0; i < letterGrid.length; i++) {
      if (!letterGrid[i]) {
        letterGrid[i] = {
          letter: RANDOM_LETTERS[Math.floor(Math.random() * RANDOM_LETTERS.length)],
          isMessage: false,
          wordIndex: null,
          originalPos: i,
          x: (i % GRID_SIZE) * 35,
          y: Math.floor(i / GRID_SIZE) * 35
        };
      }
    }
    setGrid(letterGrid);
  };
  
  const generateGrid = () => {
    const letterGrid = [];
    for (let row = 0; row < ROW_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        const index = row * GRID_SIZE + col;
        letterGrid.push({
          letter:
            RANDOM_LETTERS[Math.floor(Math.random() * RANDOM_LETTERS.length)],
          isMessage: false,
          wordIndex: null,
          originalPos: index,
          x: col * 30, // Set grid cell x position
          y: row * 30, // Set grid cell y position
        });
      }
    }
    setGrid(letterGrid);
  };

  // Mouse move with fluid letter following
  const handleMouseMove = (e) => {
    if (draggedWord) {
      api.start({ x: e.clientX - draggedWord.startX, y: e.clientY - draggedWord.startY });
      // dragAudio.play();

      // Wobble effect
      setGrid(grid.map(cell => {
        const distance = Math.hypot(cell.x - e.clientX, cell.y - e.clientY);
        return distance < RADIUS ? {
          ...cell,
          dx: Math.sin(distance * 0.1) * 5,
          dy: Math.cos(distance * 0.1) * 5
        } : { ...cell, dx: 0, dy: 0 };
      }));
    }
  };

  // Drag handlers
  const handleMouseDown = (e) => {
    const index = parseInt(e.target.dataset.index);
    const cell = grid[index];
  
    if (cell?.isMessage) {
      setHistory((prev) => [...prev, { grid, containersContent }]);
      setFuture([]);
  
      // Filter letters for the correct word instance
      const targetWordLetters = grid.filter(
        (c) =>
          c.wordIndex === cell.wordIndex &&
          c.wordInstanceId === cell.wordInstanceId
      );
  
      // Find the relative position within the word
      const startLetterIndex = targetWordLetters.findIndex(
        (c) => c.originalPos === index
      );
  
      if (startLetterIndex !== -1) {
        const orderedLetters = targetWordLetters.slice(startLetterIndex).concat(
          targetWordLetters.slice(0, startLetterIndex)
        );
  
        setDraggedWord({
          letters: orderedLetters.map((c) => c.letter),
          positions: orderedLetters.map((c) => c.originalPos),
          startX: e.clientX,
          startY: e.clientY,
          wordIndex: cell.wordIndex,
          wordInstanceId: cell.wordInstanceId
        });
      }
    }
  };
  
  const checkAllWordsPlaced = () => {
    setWordsDragged(prev => {
      const newCount = prev + 1;
      wordPlacedAudio.play();
      if (newCount === totalWords) {
        congratsAudio.play();
        setShowPopup(true); // Show popup
      }
      return newCount;
    });
  };

  const handleMouseUp = () => {
    if (draggedWord && activeContainer !== null) {
      const newGrid = grid.map(cell =>
        cell.wordIndex === draggedWord.wordIndex ? {
          ...cell,
          letter: RANDOM_LETTERS[Math.floor(Math.random() * RANDOM_LETTERS.length)],
          isMessage: false,
          wordIndex: null
        } : cell
      );
      
      setGrid(newGrid);
      setContainersContent(prev => {
        const updated = [...prev];
        updated[activeContainer] = [...updated[activeContainer], draggedWord.letters.join('')];
        return updated;
      });
  
      checkAllWordsPlaced(); // Check if all words are placed
    }

    // Reset displacements
    setGrid((prev) => prev.map((cell) => ({ ...cell, dx: 0, dy: 0 })));
    setDraggedWord(null);
    setActiveContainer(null);
  };

  const handleClosePopup = () => {
    generateCertificate(name); // Generate and download the certificate
    setShowPopup(false);
    if (typeof onReset === 'function') {
      onReset(); // Redirect to the name entry page
    }
  };

  return (
    <div
      className="grid-wrapper"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => setActiveContainer(null)}
    >
      {/* <div className="controls">
        <button onClick={undo} disabled={historyState.length === 0}>
          Undo
        </button>
        <button onClick={redo} disabled={future.length === 0}>
          Redo
        </button>
      </div> */}

      <div className="grid-container" onMouseDown={handleMouseDown}>
        {grid.map((cell, index) => (
          <animated.div
            key={index}
            className={`grid-item ${cell.isMessage ? "message-letter" : ""}`}
            data-index={index}
            style={{
              transform: `translate(${cell.dx || 0}px, ${cell.dy || 0}px)`
            }}
            // onMouseEnter={() => hoverAudio.play()}
          >
            {cell.letter}
          </animated.div>
        ))}
      </div>

      <div className="containers">
        {Array.from({ length: NUM_CONTAINERS }).map((_, index) => (
          <animated.div
            key={index}
            className="container"
            onMouseEnter={() => handleContainerMouseEnter(index)}
            onMouseLeave={handleContainerMouseLeave}
            style={index === activeContainer ? containerSprings : {}}
          >
            <div
              className={`lid ${activeContainer === index ? "open glow" : ""}`}
            ></div>
            <div className="box">
              {containersContent[index].map((word, i) => (
                <div key={i} className="stored-word">
                  {word}
                </div>
              ))}
            </div>
          </animated.div>
        ))}
      </div>

      {draggedWord && (
        <animated.div
          className="dragged-word"
          style={{
            ...springs,
            left: draggedWord.startX,
            top: draggedWord.startY,
          }}
        >
          {draggedWord.letters.map((letter, i) => (
            <animated.div
              key={i}
              className="dragged-letter"
              style={{
                transform: springs.x.to(
                  (x) =>
                    `translate(${x + i * 5}px, ${springs.y.to(
                      (y) => y + i * 3
                    )}px)`
                ),
              }}
            >
              {letter}
            </animated.div>
          ))}
        </animated.div>
      )}

      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h2>Congratulations!</h2>
            <p>All words are refined!</p>
            <button onClick={handleClosePopup}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Celebration;

