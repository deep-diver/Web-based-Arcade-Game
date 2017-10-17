const BLOCK_HEIGHT = 83;
const BLOCK_WIDTH = 101;
const BLOCK_HEIGHT_QUARTER = 83/4;
const MAX_SCORE = 5;
const MAX_HP = 5;

const characters = [
    "char-boy",
    "char-cat-girl",
    "char-horn-girl",
    "char-pink-girl",
    "char-princess-girl"
];

let enemyCount = 0;

let allEnemies = [];
let allToBeDeletedEnemies = [];

let allStars = [];
let allHearts = [];

// Enemies our player must avoid
var Enemy = function(index, x, y) {
    this.index = index;

    this.x = x;
    this.y = y;

    this.speed = 0;

    this.sprite = 'images/enemy-bug.png';
};

Enemy.prototype.update = function(dt) {
    this.x++;

    //horizontal collision
    if ((this.x + BLOCK_WIDTH >= player.x) && (this.x < player.x + BLOCK_WIDTH) &&
        (this.y === player.y)) {
        player.hp = player.hp - 1;
        player.x = 0;
        player.y = BLOCK_HEIGHT * 5 - BLOCK_HEIGHT_QUARTER;
    }

    //when enemy goes off the screen
    if (this.x > BLOCK_WIDTH * 5) {
      allEnemies.splice(this.index, 0);
      allToBeDeletedEnemies.push(this);
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

myVar = setInterval(function() {
    const row = Math.floor(Math.random() * 3) + 2;
    const yLocation = BLOCK_HEIGHT * row - BLOCK_HEIGHT_QUARTER;

    let newEnemy = new Enemy(enemyCount++, 0, yLocation);
    allEnemies.push(newEnemy);

    // release memory of enemies off the screen
    for (let idx = 0; idx < allToBeDeletedEnemies.length; idx++) {
      allToBeDeletedEnemies[idx] = null;
      allToBeDeletedEnemies.splice(idx, 0);
    }
}, 3000);

// Extra class
var Star = function(index) {
    this.x = index * BLOCK_WIDTH;
    this.y = -BLOCK_HEIGHT_QUARTER;

    this.sprite = 'images/Star.png';
}

Star.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

var Heart = function(index) {
    this.x = index * BLOCK_WIDTH;
    this.y = BLOCK_HEIGHT*8 - BLOCK_HEIGHT_QUARTER;

    this.sprite = 'images/Heart.png';
}

Heart.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

var Player = function(x, y, characterIndex) {
    this.x = x;
    this.y = y;

    this.characterIndex = characterIndex;
    this.character = characters[characterIndex];
    this.isInitStatus = true;

    this.score = 0;
    this.hp = MAX_HP;

    this.sprite = 'images/' + this.character + '.png';
    this.chooseSprite = 'images/Selector.png';
    this.heartSprite = 'images/Heart.png';
};

Player.prototype.update = function() {
    //reached water block
    if (this.y <= BLOCK_HEIGHT) {
        allStars.push(new Star(this.score++));
        
        this.x = 0;
        this.y = BLOCK_HEIGHT * 5 - BLOCK_HEIGHT_QUARTER;

        if (this.score == MAX_SCORE) {
            alert("You successfully cleared the game! now, back to the beginning!");
            player.score = 0;
            player.hp = MAX_HP;

            player.isInitStatus = true;
            player.x = 0;
            player.y = BLOCK_HEIGHT * 6 - BLOCK_HEIGHT_QUARTER;

        }
    }
};

Player.prototype.render = function() {
    if (this.isInitStatus) {
        ctx.drawImage(Resources.get(this.chooseSprite), this.x, this.y - BLOCK_HEIGHT_QUARTER);
    }

    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

    for (let i = 0; i < this.hp; i++) {
        ctx.drawImage(Resources.get(this.heartSprite), BLOCK_WIDTH * i, BLOCK_HEIGHT*8 - BLOCK_HEIGHT_QUARTER);
    }
};

Player.prototype.changeCharacter = function(characterIndex) {
    this.characterIndex = characterIndex;
    this.character = characters[characterIndex];
    this.sprite = 'images/' + this.character + '.png';
};

Player.prototyp

Player.prototype.handleInput = function(key) {
    if (!this.isInitStatus) {
        if (key == 'up') {
            if (this.y - BLOCK_HEIGHT >= -BLOCK_HEIGHT_QUARTER) {
                this.y -= BLOCK_HEIGHT;
            }
        }
        else if (key == 'down') {
            if (this.y + BLOCK_HEIGHT <= BLOCK_HEIGHT*6 -BLOCK_HEIGHT_QUARTER) {
                this.y += BLOCK_HEIGHT;
            }
        }
        else if (key == 'left') {
            if (this.x - BLOCK_WIDTH >= 0) {
                this.x -= BLOCK_WIDTH;
            }
        }
        else if (key == 'right') {
            if (this.x + BLOCK_WIDTH <= BLOCK_WIDTH*4) {
                this.x += BLOCK_WIDTH;
            }
        }
    }
    else {
        if (key == 'left') {
            let prevIndex = this.characterIndex - 1;
            if (prevIndex < 0) {
                prevIndex = characters.length-1;
            }

            this.changeCharacter(prevIndex);
        }
        else if (key == 'right') {
            let nextIndex = this.characterIndex + 1;
            if (nextIndex >= characters.length) {
                nextIndex = 0;
            }

            this.changeCharacter(nextIndex);
        }        
        else if (key == 'enter') {
            this.isInitStatus = false;
        }
    }
};

var player = new Player(0, BLOCK_HEIGHT * 6 - BLOCK_HEIGHT_QUARTER, 0);

// Key Event Listener
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        13: 'enter',
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
