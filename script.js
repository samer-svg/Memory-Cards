/**
 * Memory Card Game - Enhanced Version
 * Features: Game statistics, timer, restart functionality, difficulty levels, and improved UX
 */

class MemoryGame {
  constructor() {
    this.cards = document.querySelectorAll('.card');
    this.wrapper = document.querySelector('.wrapper');
    this.matchedCards = 0;
    this.cardOne = null;
    this.cardTwo = null;
    this.disableClick = false;
    this.moves = 0;
    this.startTime = null;
    this.gameStarted = false;
    this.timerInterval = null;
    this.gameTime = 0;
    this.difficulty = 'medium';
    this.difficultySettings = {
      easy: { pairs: 6, gridSize: 3 },
      medium: { pairs: 8, gridSize: 4 },
      hard: { pairs: 12, gridSize: 4 }
    };
    
    this.init();
  }

  /**
   * Initialize the game
   */
  init() {
    this.addEventListeners();
    this.shuffleCards();
    this.updateStats();
  }

  /**
   * Add event listeners for all game interactions
   */
  addEventListeners() {
    // Card click events
    this.cards.forEach((card, index) => {
      card.addEventListener('click', (e) => this.flipCard(e));
      
      // Keyboard event for accessibility
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.flipCard(e);
        }
      });

      card.setAttribute('data-index', index);
    });

    // Restart button
    const restartBtn = document.getElementById('restartBtn');
    if (restartBtn) {
      restartBtn.addEventListener('click', () => this.restartGame());
    }

    // Difficulty buttons
    const difficultyBtns = document.querySelectorAll('.difficulty-btn');
    difficultyBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.setDifficulty(e.target.dataset.difficulty);
      });
    });

    // Modal buttons
    const playAgainBtn = document.getElementById('playAgainBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    
    if (playAgainBtn) {
      playAgainBtn.addEventListener('click', () => {
        this.hideWinModal();
        this.restartGame();
      });
    }
    
    if (closeModalBtn) {
      closeModalBtn.addEventListener('click', () => {
        this.hideWinModal();
      });
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.key.toLowerCase() === 'r') {
        this.restartGame();
      }
    });
  }

  /**
   * Set game difficulty and update UI
   * @param {string} difficulty - 'easy', 'medium', or 'hard'
   */
  setDifficulty(difficulty) {
    this.difficulty = difficulty;
    
    // Update active button
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
      btn.classList.remove('active');
      if (btn.dataset.difficulty === difficulty) {
        btn.classList.add('active');
      }
    });

    // Restart game with new difficulty
    this.restartGame();
  }

  /**
   * Handle card flipping logic
   * @param {Event} e - Click or keyboard event
   */
  flipCard(e) {
    const clickedCard = e.target.closest('.card');
    
    if (!clickedCard || this.disableClick || clickedCard.classList.contains('flip')) {
      return;
    }

    // Start game timer on first move
    if (!this.gameStarted) {
      this.gameStarted = true;
      this.startTime = Date.now();
      this.startTimer();
    }

    // Add flip animation
    clickedCard.classList.add('flip');
    
    // Play flip sound
    this.playFlipSound();

    if (!this.cardOne) {
      this.cardOne = clickedCard;
      return;
    }

    this.cardTwo = clickedCard;
    this.disableClick = true;
    this.moves++;

    // Compare the cards
    const cardOneImg = this.cardOne.querySelector('img').src;
    const cardTwoImg = this.cardTwo.querySelector('img').src;
    
    this.matchCards(cardOneImg, cardTwoImg);
    this.updateStats();
  }

  /**
   * Check if two cards match
   * @param {string} img1 - Source of first card image
   * @param {string} img2 - Source of second card image
   */
  matchCards(img1, img2) {
    if (img1 === img2) {
      // Cards match
      this.matchedCards++;
      
      // Add success animation
      this.cardOne.classList.add('matched');
      this.cardTwo.classList.add('matched');
      
      // Play success sound
      this.playSuccessSound();
      
      // Check if game is complete
      const targetPairs = this.difficultySettings[this.difficulty].pairs;
      if (this.matchedCards === targetPairs) {
        setTimeout(() => {
          this.gameComplete();
        }, 1000);
      } else {
        this.resetCards();
      }
    } else {
      // Cards don't match
      setTimeout(() => {
        this.cardOne.classList.add('shake');
        this.cardTwo.classList.add('shake');
      }, 400);
      
      setTimeout(() => {
        this.cardOne.classList.remove('shake', 'flip');
        this.cardTwo.classList.remove('shake', 'flip');
        this.resetCards();
      }, 1200);
    }
  }

  /**
   * Reset card selection state
   */
  resetCards() {
    this.cardOne = null;
    this.cardTwo = null;
    this.disableClick = false;
  }

  /**
   * Start the game timer
   */
  startTimer() {
    this.timerInterval = setInterval(() => {
      this.gameTime++;
      this.updateStats();
    }, 1000);
  }

  /**
   * Stop the game timer
   */
  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  /**
   * Update game statistics display
   */
  updateStats() {
    const movesElement = document.getElementById('moves');
    const timerElement = document.getElementById('timer');
    const matchesElement = document.getElementById('matches');
    
    if (movesElement) {
      movesElement.textContent = this.moves;
    }
    
    if (timerElement) {
      const minutes = Math.floor(this.gameTime / 60);
      const seconds = this.gameTime % 60;
      timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    if (matchesElement) {
      const targetPairs = this.difficultySettings[this.difficulty].pairs;
      matchesElement.textContent = `${this.matchedCards}/${targetPairs}`;
    }
  }

  /**
   * Shuffle cards using Fisher-Yates algorithm
   */
  shuffleCards() {
    const wrapper = this.wrapper;
    wrapper.classList.add('shuffling');
    
    const settings = this.difficultySettings[this.difficulty];
    const imageNumbers = [];
    
    // Create array of image numbers based on difficulty
    for (let i = 1; i <= settings.pairs; i++) {
      imageNumbers.push(i, i); // Add each image twice for pairs
    }
    
    // Fisher-Yates shuffle
    for (let i = imageNumbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [imageNumbers[i], imageNumbers[j]] = [imageNumbers[j], imageNumbers[i]];
    }

    // Apply shuffled images to cards
    this.cards.forEach((card, index) => {
      card.classList.remove('flip', 'matched', 'shake');
      
      if (index < imageNumbers.length) {
        const imgTag = card.querySelector('img');
        imgTag.src = `images/img-${imageNumbers[index]}.png`;
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });

    // Update grid layout based on difficulty
    this.updateGridLayout();

    // Remove shuffling animation after delay
    setTimeout(() => {
      wrapper.classList.remove('shuffling');
    }, 500);

    // Reset game state
    this.resetGameState();
  }

  /**
   * Update grid layout based on difficulty
   */
  updateGridLayout() {
    const settings = this.difficultySettings[this.difficulty];
    const cardsContainer = document.querySelector('.cards');
    
    if (settings.gridSize === 3) {
      cardsContainer.style.gridTemplateColumns = 'repeat(3, 1fr)';
    } else {
      cardsContainer.style.gridTemplateColumns = 'repeat(4, 1fr)';
    }
  }

  /**
   * Reset game state
   */
  resetGameState() {
    this.matchedCards = 0;
    this.moves = 0;
    this.gameTime = 0;
    this.gameStarted = false;
    this.stopTimer();
    this.resetCards();
    this.updateStats();
  }

  /**
   * Restart the game
   */
  restartGame() {
    this.shuffleCards();
  }

  /**
   * Handle game completion
   */
  gameComplete() {
    this.stopTimer();
    
    // Add victory animation
    this.wrapper.classList.add('victory');
    
    // Calculate score
    const score = this.calculateScore();
    
    // Show win modal
    this.showWinModal(score);
    
    // Remove victory animation after delay
    setTimeout(() => {
      this.wrapper.classList.remove('victory');
    }, 2000);
  }

  /**
   * Calculate game score based on time and moves
   * @returns {number} Score value
   */
  calculateScore() {
    const baseScore = 1000;
    const timePenalty = this.gameTime * 2;
    const movePenalty = this.moves * 5;
    return Math.max(0, baseScore - timePenalty - movePenalty);
  }

  /**
   * Show win modal with game statistics
   * @param {number} score - Calculated game score
   */
  showWinModal(score) {
    const modal = document.getElementById('winModal');
    const winTime = document.getElementById('winTime');
    const winMoves = document.getElementById('winMoves');
    const winScore = document.getElementById('winScore');
    
    if (modal && winTime && winMoves && winScore) {
      const minutes = Math.floor(this.gameTime / 60);
      const seconds = this.gameTime % 60;
      
      winTime.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      winMoves.textContent = this.moves;
      winScore.textContent = score;
      
      modal.style.display = 'flex';
    }
  }

  /**
   * Hide win modal
   */
  hideWinModal() {
    const modal = document.getElementById('winModal');
    if (modal) {
      modal.style.display = 'none';
    }
  }

  /**
   * Play flip sound effect
   */
  playFlipSound() {
    // Create a simple audio context for sound effects
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (error) {
      console.log('Flip sound played');
    }
  }

  /**
   * Play success sound effect
   */
  playSuccessSound() {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(523, audioContext.currentTime); // C
      oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.1); // E
      oscillator.frequency.setValueAtTime(784, audioContext.currentTime + 0.2); // G
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      console.log('Success sound played');
    }
  }
}

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new MemoryGame();
});