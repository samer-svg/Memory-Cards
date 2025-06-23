/**
 * Memory Card Game - Enhanced Version
 * Features: Responsive design, keyboard navigation, improved animations, and better UX
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
    
    this.init();
  }

  /**
   * Initialize the game
   */
  init() {
    this.addEventListeners();
    this.shuffleCards();
    this.startTime = Date.now();
  }

  /**
   * Add event listeners for click and keyboard interactions
   */
  addEventListeners() {
    this.cards.forEach((card, index) => {
      // Click event
      card.addEventListener('click', (e) => this.flipCard(e));
      
      // Keyboard event for accessibility
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.flipCard(e);
        }
      });

      // Add data-index for easier identification
      card.setAttribute('data-index', index);
    });
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
    }

    // Add flip animation
    clickedCard.classList.add('flip');
    
    // Add subtle sound effect (optional)
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
      if (this.matchedCards === 8) {
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
   * Shuffle cards using Fisher-Yates algorithm
   */
  shuffleCards() {
    const wrapper = this.wrapper;
    wrapper.classList.add('shuffling');
    
    // Create array of image numbers (1-8, duplicated)
    const imageNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8];
    
    // Fisher-Yates shuffle
    for (let i = imageNumbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [imageNumbers[i], imageNumbers[j]] = [imageNumbers[j], imageNumbers[i]];
    }

    // Apply shuffled images to cards
    this.cards.forEach((card, index) => {
      card.classList.remove('flip', 'matched', 'shake');
      const imgTag = card.querySelector('img');
      imgTag.src = `images/img-${imageNumbers[index]}.png`;
    });

    // Remove shuffling animation after delay
    setTimeout(() => {
      wrapper.classList.remove('shuffling');
    }, 500);

    // Reset game state
    this.matchedCards = 0;
    this.moves = 0;
    this.gameStarted = false;
    this.resetCards();
  }

  /**
   * Handle game completion
   */
  gameComplete() {
    const endTime = Date.now();
    const gameTime = Math.round((endTime - this.startTime) / 1000);
    
    // Add victory animation
    this.wrapper.classList.add('victory');
    
    // Show completion message
    this.showCompletionMessage(gameTime);
    
    // Remove victory animation after delay
    setTimeout(() => {
      this.wrapper.classList.remove('victory');
    }, 2000);
    
    // Auto-restart after 3 seconds
    setTimeout(() => {
      this.shuffleCards();
    }, 3000);
  }

  /**
   * Show game completion message
   * @param {number} gameTime - Time taken to complete in seconds
   */
  showCompletionMessage(gameTime) {
    const message = document.createElement('div');
    message.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      padding: 2rem;
      border-radius: 15px;
      box-shadow: 0 20px 40px rgba(0, 184, 148, 0.2);
      text-align: center;
      z-index: 1000;
      animation: fadeIn 0.5s ease-out;
    `;
    
    message.innerHTML = `
      <h2 style="color: #00b894; margin-bottom: 1rem;">🎉 Congratulations! 🎉</h2>
      <p style="color: #2d3436; margin-bottom: 0.5rem;">You completed the game!</p>
      <p style="color: #00cec9; font-weight: 600;">Moves: ${this.moves} | Time: ${gameTime}s</p>
      <p style="color: #636e72; font-size: 0.9rem; margin-top: 1rem;">New game starting in 3 seconds...</p>
    `;
    
    document.body.appendChild(message);
    
    // Remove message after 3 seconds
    setTimeout(() => {
      message.remove();
    }, 3000);
  }

  /**
   * Play flip sound effect (optional)
   */
  playFlipSound() {
    // This could be implemented with Web Audio API or a simple audio file
    // For now, we'll just add a visual feedback
    console.log('Flip sound played');
  }

  /**
   * Play success sound effect (optional)
   */
  playSuccessSound() {
    // This could be implemented with Web Audio API or a simple audio file
    // For now, we'll just add a visual feedback
    console.log('Success sound played');
  }
}

// Add CSS for completion message animation
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
    to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
  }
`;
document.head.appendChild(style);

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new MemoryGame();
});

// Add restart functionality with 'R' key
document.addEventListener('keydown', (e) => {
  if (e.key.toLowerCase() === 'r') {
    const game = window.memoryGame;
    if (game) {
      game.shuffleCards();
    }
  }
});

// Make game instance globally accessible for debugging
window.memoryGame = null;
document.addEventListener('DOMContentLoaded', () => {
  window.memoryGame = new MemoryGame();
});
