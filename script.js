document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const scoreDisplay = document.getElementById('scoreDisplay');
    const levelDisplay = document.getElementById('levelDisplay');
    const lengthDisplay = document.getElementById('lengthDisplay');
    const nextLevelDisplay = document.getElementById('nextLevelDisplay');
    const highScoreDisplay = document.getElementById('highScoreDisplay');
    const pauseButton = document.getElementById('pauseButton');
    const restartButton = document.getElementById('restartButton');
    const gameOverModal = document.getElementById('gameOverModal');
    const finalScoreDisplay = document.getElementById('finalScoreDisplay');
    const finalLengthDisplay = document.getElementById('finalLengthDisplay');
    const finalLevelDisplay = document.getElementById('finalLevelDisplay');
    const playAgainButton = document.getElementById('playAgainButton');

    // Game settings
    const gridSize = 20;
    const tileCount = canvas.width / gridSize;
    let snake = [{x: 10, y: 10}];
    let food = null;
    let obstacles = [];
    let dx = 1;
    let dy = 0;
    let score = 0;
    let level = 1;
    let gameSpeed = 200;
    let gameLoop;
    let isPaused = false;
    let highScore = localStorage.getItem('snakeHighScore') || 0;
    
    // Level thresholds based on snake length
    const levelThresholds = [0, 10, 20, 50, 100];
    
    highScoreDisplay.textContent = highScore;
    lengthDisplay.textContent = snake.length;
    updateNextLevelInfo();

    function updateNextLevelInfo() {
        const currentLength = snake.length;
        let nextThreshold;
        
        if (level < levelThresholds.length - 1) {
            nextThreshold = levelThresholds[level + 1];
            nextLevelDisplay.textContent = nextThreshold;
        } else {
            nextLevelDisplay.textContent = "Max Level";
        }
    }

    function checkLevelProgression() {
        const currentLength = snake.length;
        let newLevel = 1;
        
        for (let i = 1; i < levelThresholds.length; i++) {
            if (currentLength >= levelThresholds[i]) {
                newLevel = i + 1;
            } else {
                break;
            }
        }
        
        if (newLevel !== level) {
            level = newLevel;
            levelDisplay.textContent = level;
            gameSpeed = Math.max(50, 200 - (level - 1) * 30);
            clearInterval(gameLoop);
            gameLoop = setInterval(gameStep, gameSpeed);
            generateObstacles();
            return true;
        }
        
        return false;
    }

    function generateFood() {
        let newFood;
        do {
            newFood = {
                x: Math.floor(Math.random() * tileCount),
                y: Math.floor(Math.random() * tileCount)
            };
        } while (
            snake.some(segment => segment.x === newFood.x && segment.y === newFood.y) ||
            obstacles.some(obs => obs.x === newFood.x && obs.y === newFood.y)
        );
        return newFood;
    }

    function generateObstacles() {
        obstacles = [];
        // Increase obstacles based on level - more obstacles at higher levels
        const obstacleCount = level * 3;
        for (let i = 0; i < obstacleCount; i++) {
            let newObstacle;
            let attempts = 0;
            do {
                newObstacle = {
                    x: Math.floor(Math.random() * tileCount),
                    y: Math.floor(Math.random() * tileCount)
                };
                attempts++;
                // Prevent infinite loop if board gets too crowded
                if (attempts > 100) break;
            } while (
                snake.some(segment => segment.x === newObstacle.x && segment.y === newObstacle.y) ||
                (food && food.x === newObstacle.x && food.y === newObstacle.y) ||
                obstacles.some(obs => obs.x === newObstacle.x && obs.y === newObstacle.y) ||
                // Keep some space around the snake head to avoid immediate collisions
                (Math.abs(newObstacle.x - snake[0].x) < 3 && Math.abs(newObstacle.y - snake[0].y) < 3)
            );
            
            if (attempts <= 100) {
                obstacles.push(newObstacle);
            }
        }
    }

    function drawGame() {
        // Clear canvas
        ctx.fillStyle = '#ECF0F1';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw grid lines (optional)
        ctx.strokeStyle = '#BDC3C7';
        ctx.lineWidth = 0.5;
        for (let i = 0; i < tileCount; i++) {
            // Vertical lines
            ctx.beginPath();
            ctx.moveTo(i * gridSize, 0);
            ctx.lineTo(i * gridSize, canvas.height);
            ctx.stroke();
            
            // Horizontal lines
            ctx.beginPath();
            ctx.moveTo(0, i * gridSize);
            ctx.lineTo(canvas.width, i * gridSize);
            ctx.stroke();
        }

        // Draw obstacles
        ctx.fillStyle = '#34495E';
        obstacles.forEach(obs => {
            ctx.fillRect(
                obs.x * gridSize, 
                obs.y * gridSize, 
                gridSize - 2, 
                gridSize - 2
            );
        });

        // Draw snake with gradient colors based on position
        snake.forEach((segment, index) => {
            // Head is different color
            if (index === 0) {
                ctx.fillStyle = '#E67E22';
            } else {
                // Body color based on level
                const snakeColors = ['#2ECC71', '#3498DB', '#9B59B6', '#F1C40F', '#E74C3C'];
                ctx.fillStyle = snakeColors[(level - 1) % snakeColors.length];
            }
            
            ctx.fillRect(
                segment.x * gridSize, 
                segment.y * gridSize, 
                gridSize - 2, 
                gridSize - 2
            );
        });

        // Draw food with pulsing effect
        const pulseSize = Math.sin(Date.now() / 200) * 2;
        ctx.fillStyle = '#E74C3C';
        ctx.fillRect(
            food.x * gridSize - pulseSize/2, 
            food.y * gridSize - pulseSize/2, 
            gridSize - 2 + pulseSize, 
            gridSize - 2 + pulseSize
        );
    }

    function moveSnake() {
        const head = {x: snake[0].x + dx, y: snake[0].y + dy};
        snake.unshift(head);

        // Check food collision
        if (head.x === food.x && head.y === food.y) {
            score += level;
            scoreDisplay.textContent = score;
            food = generateFood();
            
            // Update length display
            lengthDisplay.textContent = snake.length;
            
            // Check if we need to level up
            const leveledUp = checkLevelProgression();
            if (leveledUp) {
                updateNextLevelInfo();
            }
        } else {
            snake.pop();
        }
    }

    function checkCollision() {
        const head = snake[0];

        // Wall collision
        if (
            head.x < 0 || head.x >= tileCount || 
            head.y < 0 || head.y >= tileCount
        ) {
            gameOver();
            return;
        }

        // Obstacle collision
        if (obstacles.some(obs => head.x === obs.x && head.y === obs.y)) {
            gameOver();
            return;
        }

        // Self collision
        for (let i = 1; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
                gameOver();
                return;
            }
        }
    }

    function gameOver() {
        clearInterval(gameLoop);
        
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('snakeHighScore', highScore);
            highScoreDisplay.textContent = highScore;
        }

        finalScoreDisplay.textContent = score;
        finalLengthDisplay.textContent = snake.length;
        finalLevelDisplay.textContent = level;
        gameOverModal.style.display = 'flex';
    }

    function resetGame() {
        snake = [{x: 10, y: 10}];
        dx = 1;
        dy = 0;
        score = 0;
        level = 1;
        gameSpeed = 200;
        scoreDisplay.textContent = score;
        levelDisplay.textContent = level;
        lengthDisplay.textContent = snake.length;
        gameOverModal.style.display = 'none';
        
        food = generateFood();
        generateObstacles();
        updateNextLevelInfo();
        
        clearInterval(gameLoop);
        gameLoop = setInterval(gameStep, gameSpeed);
    }

    function gameStep() {
        if (!isPaused) {
            moveSnake();
            checkCollision();
            drawGame();
        }
    }

    // Control handling
    document.addEventListener('keydown', (e) => {
        switch(e.key) {
            case 'ArrowUp':    if (dy !== 1)  { dx = 0; dy = -1; } break;
            case 'ArrowDown':  if (dy !== -1) { dx = 0; dy = 1;  } break;
            case 'ArrowLeft':  if (dx !== 1)  { dx = -1; dy = 0; } break;
            case 'ArrowRight': if (dx !== -1) { dx = 1; dy = 0;  } break;
            case ' ': // Spacebar for pause
                isPaused = !isPaused;
                pauseButton.textContent = isPaused ? 'Resume' : 'Pause';
                break;
        }
    });

    // Button event listeners
    pauseButton.addEventListener('click', () => {
        isPaused = !isPaused;
        pauseButton.textContent = isPaused ? 'Resume' : 'Pause';
    });

    restartButton.addEventListener('click', resetGame);
    playAgainButton.addEventListener('click', resetGame);

    // Start game
    food = generateFood();
    generateObstacles();
    gameLoop = setInterval(gameStep, gameSpeed);
});