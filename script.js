document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const scoreDisplay = document.getElementById('scoreDisplay');
    const levelDisplay = document.getElementById('levelDisplay');
    const highScoreDisplay = document.getElementById('highScoreDisplay');
    const pauseButton = document.getElementById('pauseButton');
    const restartButton = document.getElementById('restartButton');
    const gameOverModal = document.getElementById('gameOverModal');
    const finalScoreDisplay = document.getElementById('finalScoreDisplay');
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

    highScoreDisplay.textContent = highScore;

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
        const obstacleCount = level * 2;
        for (let i = 0; i < obstacleCount; i++) {
            let newObstacle;
            do {
                newObstacle = {
                    x: Math.floor(Math.random() * tileCount),
                    y: Math.floor(Math.random() * tileCount)
                };
            } while (
                snake.some(segment => segment.x === newObstacle.x && segment.y === newObstacle.y) ||
                obstacles.some(obs => obs.x === newObstacle.x && obs.y === newObstacle.y)
            );
            obstacles.push(newObstacle);
        }
    }

    function drawGame() {
        // Clear canvas
        ctx.fillStyle = '#ECF0F1';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

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

        // Draw snake
        ctx.fillStyle = level % 2 === 0 ? '#3498DB' : '#2ECC71';
        snake.forEach((segment, index) => {
            ctx.fillRect(
                segment.x * gridSize, 
                segment.y * gridSize, 
                gridSize - 2, 
                gridSize - 2
            );
        });

        // Draw food
        ctx.fillStyle = '#E74C3C';
        ctx.fillRect(
            food.x * gridSize, 
            food.y * gridSize, 
            gridSize - 2, 
            gridSize - 2
        );
    }

    function moveSnake() {
        const head = {x: snake[0].x + dx, y: snake[0].y + dy};
        snake.unshift(head);

        // Check food collision
        if (head.x === food.x && head.y === food.y) {
            score += level;
            scoreDisplay.textContent = score;

            // Level up logic
            if (score % 50 === 0) {
                level++;
                levelDisplay.textContent = level;
                gameSpeed = Math.max(50, gameSpeed - 20);
                clearInterval(gameLoop);
                gameLoop = setInterval(gameStep, gameSpeed);
                generateObstacles();
            }

            food = generateFood();
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
        gameOverModal.style.display = 'none';
        
        food = generateFood();
        generateObstacles();
        
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