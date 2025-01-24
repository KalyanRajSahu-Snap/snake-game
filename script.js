document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const scoreDisplay = document.getElementById('scoreDisplay');

    // Game settings
    const gridSize = 20;
    const tileCount = canvas.width / gridSize;
    let snake = [{x: 10, y: 10}];
    let food = generateFood();
    let dx = 1;
    let dy = 0;
    let score = 0;
    let gameSpeed = 150;
    let gameLoop;

    function generateFood() {
        return {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };
    }

    function drawGame() {
        // Clear canvas
        ctx.fillStyle = '#ECF0F1';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw snake
        ctx.fillStyle = '#2ECC71';
        snake.forEach(segment => {
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
            score++;
            scoreDisplay.textContent = score;
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
        }

        // Self collision
        for (let i = 1; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
                gameOver();
            }
        }
    }

    function gameOver() {
        clearInterval(gameLoop);
        alert(`Game Over! Your score: ${score}`);
        resetGame();
    }

    function resetGame() {
        snake = [{x: 10, y: 10}];
        food = generateFood();
        dx = 1;
        dy = 0;
        score = 0;
        scoreDisplay.textContent = score;
        gameLoop = setInterval(gameStep, gameSpeed);
    }

    function gameStep() {
        moveSnake();
        checkCollision();
        drawGame();
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

    // Start game
    resetGame();
});