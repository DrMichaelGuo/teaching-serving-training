class TennisServingGame {
    constructor() {
        this.scores = ['0', '15', '30', '40'];
        this.currentScenario = null;
        this.stats = {
            correct: 0,
            total: 0
        };
        
        this.initializeElements();
        this.bindEvents();
        this.generateNewScenario();
    }
    
    initializeElements() {
        this.elements = {
            currentScore: document.getElementById('current-score'),
            servingPlayer: document.getElementById('serving-player'),
            gameInfo: document.getElementById('game-info'),
            correctCount: document.getElementById('correct-count'),
            totalCount: document.getElementById('total-count'),
            accuracy: document.getElementById('accuracy'),
            feedback: document.getElementById('feedback'),
            newScenarioBtn: document.getElementById('new-scenario'),
            resetStatsBtn: document.getElementById('reset-stats'),
            showRulesBtn: document.getElementById('show-rules'),
            rulesModal: document.getElementById('rules-modal'),
            closeModal: document.getElementById('close-modal'),
            servingPositions: document.querySelectorAll('.serving-position')
        };
    }
    
    bindEvents() {
        // Serving position clicks
        this.elements.servingPositions.forEach(pos => {
            pos.addEventListener('click', (e) => this.handleServingPositionClick(e));
        });
        
        // Button clicks
        this.elements.newScenarioBtn.addEventListener('click', () => this.generateNewScenario());
        this.elements.resetStatsBtn.addEventListener('click', () => this.resetStats());
        this.elements.showRulesBtn.addEventListener('click', () => this.showRules());
        this.elements.closeModal.addEventListener('click', () => this.hideRules());
        
        // Modal close on outside click
        this.elements.rulesModal.addEventListener('click', (e) => {
            if (e.target === this.elements.rulesModal) {
                this.hideRules();
            }
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideRules();
            } else if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                this.generateNewScenario();
            } else if (e.key === 'r' || e.key === 'R') {
                this.showRules();
            }
        });
    }
    
    generateNewScenario() {
        this.clearServingPositionStates();
        this.elements.feedback.className = 'feedback neutral';
        this.elements.feedback.innerHTML = '<p>Click on a serving position to start!</p>';
        
        // Generate random score scenario
        const playerScore = Math.floor(Math.random() * 5); // 0-4 (including deuce scenarios)
        const opponentScore = Math.floor(Math.random() * 5);
        
        // Handle special cases for realistic tennis scores
        let finalPlayerScore, finalOpponentScore;
        
        if (playerScore <= 3 && opponentScore <= 3) {
            // Normal scoring
            finalPlayerScore = playerScore;
            finalOpponentScore = opponentScore;
        } else {
            // Handle deuce and advantage scenarios
            if (Math.random() < 0.3) {
                // Deuce
                finalPlayerScore = 3;
                finalOpponentScore = 3;
            } else {
                // Advantage scenarios
                const advantagePlayer = Math.random() < 0.5;
                if (advantagePlayer) {
                    finalPlayerScore = 4;
                    finalOpponentScore = 3;
                } else {
                    finalPlayerScore = 3;
                    finalOpponentScore = 4;
                }
            }
        }
        
        this.currentScenario = {
            playerScore: finalPlayerScore,
            opponentScore: finalOpponentScore
        };
        
        this.updateDisplay();
    }
    
    updateDisplay() {
        const { playerScore, opponentScore } = this.currentScenario;
        
        // Update score display
        const playerScoreText = this.getScoreText(playerScore);
        const opponentScoreText = this.getScoreText(opponentScore);
        
        this.elements.currentScore.textContent = `${playerScoreText}-${opponentScoreText}`;
        this.elements.servingPlayer.textContent = 'You are serving';
    }
    
    getScoreText(score) {
        if (score <= 3) {
            return this.scores[score];
        } else if (score === 4) {
            // Check if it's advantage or game point
            const { playerScore, opponentScore } = this.currentScenario;
            if ((playerScore === 4 && opponentScore === 3) || (playerScore === 3 && opponentScore === 4)) {
                return score === 4 ? 'Ad' : '40';
            }
        }
        return this.scores[Math.min(score, 3)];
    }
    
    getCorrectPosition() {
        const totalPoints = this.currentScenario.playerScore + this.currentScenario.opponentScore;
        return (totalPoints % 2 === 0) ? 'right' : 'left';
    }
    
    handleServingPositionClick(event) {
        const clickedPosition = event.currentTarget.dataset.position;
        const correctPosition = this.getCorrectPosition();
        const isCorrect = clickedPosition === correctPosition;
        
        // Update stats
        this.stats.total++;
        if (isCorrect) {
            this.stats.correct++;
        }
        
        // Visual feedback
        this.clearServingPositionStates();
        
        if (isCorrect) {
            event.currentTarget.classList.add('correct');
            this.elements.feedback.className = 'feedback correct';
            this.elements.feedback.innerHTML = '<p>✅ Correct! That\'s the right place to stand.</p>';
        } else {
            event.currentTarget.classList.add('incorrect');
            const correctElem = document.querySelector(`.serving-position[data-position="${correctPosition}"]`);
            if (correctElem) correctElem.classList.add('correct');
            this.elements.feedback.className = 'feedback incorrect';
            this.elements.feedback.innerHTML = `<p>❌ Not quite! You should stand on the <strong>${correctPosition === 'right' ? 'deuce (right)' : 'ad (left)'}</strong> side.</p>`;
        }
        
        this.updateStats();
        
        // Auto-generate new scenario after a delay
        setTimeout(() => {
            this.generateNewScenario();
        }, 2000);
    }
    
    clearServingPositionStates() {
        this.elements.servingPositions.forEach(pos => {
            pos.classList.remove('correct', 'incorrect');
        });
    }
    
    updateStats() {
        this.elements.correctCount.textContent = this.stats.correct;
        this.elements.totalCount.textContent = this.stats.total;
        
        const accuracy = this.stats.total > 0 ? 
            Math.round((this.stats.correct / this.stats.total) * 100) : 0;
        this.elements.accuracy.textContent = `${accuracy}%`;
    }
    
    resetStats() {
        this.stats.correct = 0;
        this.stats.total = 0;
        this.updateStats();
        
        this.elements.feedback.className = 'feedback neutral';
        this.elements.feedback.innerHTML = '<p>Stats reset! Ready for a fresh start! 🎾</p>';
        
        setTimeout(() => {
            this.generateNewScenario();
        }, 1500);
    }
    
    showRules() {
        this.elements.rulesModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
    
    hideRules() {
        this.elements.rulesModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new TennisServingGame();
});

// Add some additional helpful functions
window.addEventListener('beforeunload', (e) => {
    // Save stats to localStorage for persistence
    const stats = {
        correct: document.getElementById('correct-count').textContent,
        total: document.getElementById('total-count').textContent
    };
    localStorage.setItem('tennisServingStats', JSON.stringify(stats));
});

// Load saved stats on page load
window.addEventListener('load', () => {
    const savedStats = localStorage.getItem('tennisServingStats');
    if (savedStats) {
        try {
            const stats = JSON.parse(savedStats);
            if (stats.total > 0) {
                const loadStats = confirm('Would you like to continue with your previous stats?');
                if (loadStats) {
                    document.getElementById('correct-count').textContent = stats.correct;
                    document.getElementById('total-count').textContent = stats.total;
                    
                    const accuracy = Math.round((parseInt(stats.correct) / parseInt(stats.total)) * 100);
                    document.getElementById('accuracy').textContent = `${accuracy}%`;
                }
            }
        } catch (error) {
            console.log('Could not load saved stats');
        }
    }
});
