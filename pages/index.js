import { useState, useEffect } from 'react';
import puzzles from '../data/puzzles.json';

export default function Home() {
  const [currentPuzzle, setCurrentPuzzle] = useState(puzzles[0]);
  const [score, setScore] = useState(0);
  const [displayScore, setDisplayScore] = useState(0);
  const [energy, setEnergy] = useState(100); // Énergie initiale fixe
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [gameFailed, setGameFailed] = useState(false);
  const [hint, setHint] = useState('');
  const [showIntro, setShowIntro] = useState(true);
  const [edgenActive, setEdgenActive] = useState(false);
  const [jokerUsed, setJokerUsed] = useState(false); // Suivi joker par puzzle

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedScore = Number(localStorage.getItem('score')) || 0;
      setScore(savedScore);
      setDisplayScore(savedScore);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('score', score);
    }
    const increment = Math.ceil((score - displayScore) / 10);
    if (increment !== 0) {
      setEdgenActive(true);
      const timer = setInterval(() => {
        setDisplayScore(prev => {
          const newScore = prev + increment;
          return newScore >= score ? score : newScore;
        });
      }, 50);
      setTimeout(() => setEdgenActive(false), 1000);
      return () => clearInterval(timer);
    }
  }, [score, displayScore]);

  useEffect(() => {
    setHint('');
    setFeedback('');
    setJokerUsed(false); // Réinitialiser joker pour nouveau puzzle
  }, [currentPuzzle]);

  const handleToolClick = (tool) => {
    if (energy >= 50 && !gameOver && !gameFailed && !jokerUsed) {
      setEnergy(energy - 50);
      setJokerUsed(true);
      const hintText = tool === 'zk-rollup'
        ? `Hint: Part of the solution is "${currentPuzzle.solution.split(' ')[0]}"`
        : `Hint: Focus on "${currentPuzzle.solution.split(' ')[1] || currentPuzzle.solution}"`;
      setHint(hintText);
      setFeedback(`Used ${tool}. ${hintText}`);
      if (energy - 50 <= 0) {
        setGameFailed(true);
        setFeedback('Energy depleted! Mission failed.');
      }
    } else if (jokerUsed) {
      setFeedback('Only one joker per puzzle allowed!');
    } else if (energy < 50) {
      setFeedback('Not enough energy for joker!');
    }
  };

  const handleSubmit = () => {
    if (gameOver || gameFailed) return;
    if (input.toLowerCase() === currentPuzzle.solution.toLowerCase()) {
      const edgensEarned = jokerUsed ? currentPuzzle.edgens : currentPuzzle.edgens + 20;
      setScore(score + edgensEarned);
      setFeedback(`Code Cracked! ${jokerUsed ? '' : 'No joker bonus: +20 '}Edgens: ${edgensEarned}!`);
      const nextPuzzleIndex = puzzles.findIndex(p => p.id === currentPuzzle.id) + 1;
      if (nextPuzzleIndex < puzzles.length) {
        const nextEnergy = Math.max(energy, puzzles[nextPuzzleIndex].energy);
        setCurrentPuzzle(puzzles[nextPuzzleIndex]);
        setEnergy(nextEnergy);
        setInput('');
        setFeedback('');
        setHint('');
      } else {
        setFeedback('All Vaults Breached! LayerEdge Legend!');
        setGameOver(true);
      }
    } else {
      setEnergy(energy - 10);
      setFeedback('Access Denied! -10 Energy.');
      if (energy - 10 <= 0) {
        setGameFailed(true);
        setFeedback('Energy depleted! Mission failed.');
      }
    }
  };

  const handleRestart = () => {
    setCurrentPuzzle(puzzles[0]);
    setScore(0);
    setDisplayScore(0);
    setEnergy(100); // Réinitialiser énergie
    setInput('');
    setFeedback('');
    setHint('');
    setGameOver(false);
    setGameFailed(false);
    setShowIntro(true);
    setJokerUsed(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('score', '0');
    }
  };

  if (showIntro) {
    return (
      <div className="container intro">
        <h1>LayerEdge Codebreaker</h1>
        <div className="intro-content">
          <h2>Welcome, Cryptanalyst</h2>
          <p>
            Infiltrate the blockchain with <span className="highlight">LayerEdge</span>.<br />
            Crack 22 encrypted codes using <span className="highlight">ZK Rollups</span> and <span className="highlight">Data Bridges</span>.<br />
            Secure <span className="highlight">Edgens</span> and become a legend.<br />
            Ready to hack the future?
          </p>
          <button className="start-button" onClick={() => setShowIntro(false)}>
            Start Hacking
          </button>
        <div className="footer">
        Developed by Karol |{' '}
        <a href="https://twitter.com/iveobod" target="_blank" rel="noopener noreferrer">
          Twitter
        </a>
      </div>
      </div>
    );
  }

  if (gameOver || gameFailed) {
    return (
      <div className="container">
        <h1>LayerEdge Codebreaker</h1>
        <h2>{gameOver ? 'Mission Complete!' : 'Mission Failed!'}</h2>
        <p>{gameOver ? 'You’re a LayerEdge Legend!' : 'Energy Depleted. Retry!'}</p>
        <p className="score">
          Final Score: <span className="edgens">{displayScore}</span>{' '}
          <img src="/edge.jpg" alt="Edgen" className={`edgen-icon ${edgenActive ? 'active' : ''}`} />
        </p>
        <div className="actions">
          <button onClick={handleRestart}>Hack Again</button>
          <button
            onClick={() =>
              window.open(
                `https://twitter.com/intent/tweet?text=I scored ${score} Edgens in LayerEdge Codebreaker! Join the elite: ${window.location.href} #LayerEdge`
              )
            }
          >
            Share Score
          </button>
        </div>
        <div className="footer">
        Developed by Karol |{' '}
        <a href="https://twitter.com/iveobod" target="_blank" rel="noopener noreferrer">
          Twitter
        </a>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>LayerEdge Codebreaker</h1>
      <p className="score">
        Edgens: <span className="edgens">{displayScore}</span>{' '}
        <img src="/edge.jpg" alt="Edgen" className={`edgen-icon ${edgenActive ? 'active' : ''}`} />
      </p>
      <p>Energy: <span className="energy">{energy}</span></p>
      <p>Level: {currentPuzzle.id} / {puzzles.length}</p>
      <div className="puzzle">
        <div className="code">{currentPuzzle.code}</div>
        <div className="task">{currentPuzzle.task}</div>
        {hint && <div className="hint">{hint}</div>}
        <div className="tools">
          {currentPuzzle.tools.map((tool, index) => (
            <button key={index} onClick={() => handleToolClick(tool)} disabled={gameOver || gameFailed || jokerUsed}>
              {tool}
            </button>
          ))}
        </div>
        <div className="actions">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter solution"
            className="input"
            disabled={gameOver || gameFailed}
          />
          <button onClick={handleSubmit} disabled={gameOver || gameFailed}>
            Submit
          </button>
          <button onClick={handleRestart}>Restart</button>
        </div>
        {feedback && <div className="feedback">{feedback}</div>}
        <div className="message">{currentPuzzle.message}</div>
      </div>
      <div className="footer">
        Developed by Karol |{' '}
        <a href="https://twitter.com/iveobod" target="_blank" rel="noopener noreferrer">
          Twitter
        </a>
      </div>
    </div>
  );
}
