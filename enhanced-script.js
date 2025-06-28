/**
 * Enhanced Memory Card Game
 * Features: Game statistics, timer, restart functionality, difficulty levels, and improved UX
 */

class EnhancedMemoryGame {
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
      medium: { pairs: 8, gridSize: 4 }
    };
    
    this.init();
  }

  init() {
    this.addEventListeners();
    this.shuffleCards();
    this.updateStats();
  }

  addEventListeners() {
    this.cards.forEach((card, index) => {
      card.addEventListener('click', (e) => this.flipCard(e));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.flipCard(e);
        }
      });
      card.setAttribute('data-index', index);
    });

    const restartBtn = document.getElementById('restartBtn');
    if (restartBtn) {
      restartBtn.addEventListener('click', () => this.restartGame());
    }

    const difficultyBtns = document.querySelectorAll('.difficulty-btn');
    difficultyBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.setDifficulty(e.target.dataset.difficulty);
      });
    });

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

    document.addEventListener('keydown', (e) => {
      if (e.key.toLowerCase() === 'r') {
        this.restartGame();
      }
    });
  }

  setDifficulty(difficulty) {
    this.difficulty = difficulty;
    
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
      btn.classList.remove('active');
      if (btn.dataset.difficulty === difficulty) {
        btn.classList.add('active');
      }
    });

    this.restartGame();
  }

  flipCard(e) {
    const clickedCard = e.target.closest('.card');
    
    if (!clickedCard || this.disableClick || clickedCard.classList.contains('flip')) {
      return;
    }

    if (!this.gameStarted) {
      this.gameStarted = true;
      this.startTime = Date.now();
      this.startTimer();
    }

    clickedCard.classList.add('flip');
    this.playFlipSound();

    if (!this.cardOne) {
      this.cardOne = clickedCard;
      return;
    }

    this.cardTwo = clickedCard;
    this.disableClick = true;
    this.moves++;

    const cardOneImg = this.cardOne.querySelector('img').src;
    const cardTwoImg = this.cardTwo.querySelector('img').src;
    
    this.matchCards(cardOneImg, cardTwoImg);
    this.updateStats();
  }

  matchCards(img1, img2) {
    if (img1 === img2) {
      this.matchedCards++;
      
      this.cardOne.classList.add('matched');
      this.cardTwo.classList.add('matched');
      
      this.playSuccessSound();
      
      const targetPairs = this.difficultySettings[this.difficulty].pairs;
      if (this.matchedCards === targetPairs) {
        setTimeout(() => {
          this.gameComplete();
        }, 1000);
      } else {
        this.resetCards();
      }
    } else {
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

  resetCards() {
    this.cardOne = null;
    this.cardTwo = null;
    this.disableClick = false;
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      this.gameTime++;
      this.updateStats();
    }, 1000);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

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

  shuffleCards() {
    const wrapper = this.wrapper;
    wrapper.classList.add('shuffling');
    
    const settings = this.difficultySettings[this.difficulty];
    const imageNumbers = [];
    
    for (let i = 1; i <= settings.pairs; i++) {
      imageNumbers.push(i, i);
    }
    
    for (let i = imageNumbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [imageNumbers[i], imageNumbers[j]] = [imageNumbers[j], imageNumbers[i]];
    }

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

    this.updateGridLayout();

    setTimeout(() => {
      wrapper.classList.remove('shuffling');
    }, 500);

    this.resetGameState();
  }

  updateGridLayout() {
    const settings = this.difficultySettings[this.difficulty];
    const cardsContainer = document.querySelector('.cards');
    
    if (settings.gridSize === 3) {
      cardsContainer.style.gridTemplateColumns = 'repeat(3, 1fr)';
    } else {
      cardsContainer.style.gridTemplateColumns = 'repeat(4, 1fr)';
    }
  }

  resetGameState() {
    this.matchedCards = 0;
    this.moves = 0;
    this.gameTime = 0;
    this.gameStarted = false;
    this.stopTimer();
    this.resetCards();
    this.updateStats();
  }

  restartGame() {
    this.shuffleCards();
  }

  gameComplete() {
    this.stopTimer();
    
    this.wrapper.classList.add('victory');
    
    const score = this.calculateScore();
    
    this.showWinModal(score);
    
    setTimeout(() => {
      this.wrapper.classList.remove('victory');
    }, 2000);
  }

  calculateScore() {
    const baseScore = 1000;
    const timePenalty = this.gameTime * 2;
    const movePenalty = this.moves * 5;
    return Math.max(0, baseScore - timePenalty - movePenalty);
  }

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

  hideWinModal() {
    const modal = document.getElementById('winModal');
    if (modal) {
      modal.style.display = 'none';
    }
  }

  playFlipSound() {
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

  playSuccessSound() {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(523, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(784, audioContext.currentTime + 0.2);
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      console.log('Success sound played');
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new EnhancedMemoryGame();
});
