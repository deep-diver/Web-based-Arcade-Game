const blockHeight = 83;
const blockWidth = 101;
const blockHeightQuarter = 83/4;

let enemyCount = 0;

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
    if ((this.x + blockWidth >= player.x) && (this.x < player.x + blockWidth) &&
        (this.y === player.y)) {
      console.log("enemy x: " + this.x + ", player x: " + player.x)
    }

    //when enemy goes off the screen
    if (this.x > blockWidth * 5) {
      allEnemies.splice(this.index, 0);
      allToBeDeletedEnemies.push(this);
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

let allEnemies = [];
let allToBeDeletedEnemies = [];

myVar = setInterval(function() {
    const row = Math.floor(Math.random() * 3) + 1;
    const yLocation = blockHeight * row - blockHeightQuarter;

    let newEnemy = new Enemy(enemyCount++, 0, yLocation);
    allEnemies.push(newEnemy);

    // release memory of enemies off the screen
    for (let idx = 0; idx < allToBeDeletedEnemies.length; idx++) {
      allToBeDeletedEnemies[idx] = null;
      allToBeDeletedEnemies.splice(idx, 0);
    }
}, 3000);

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function(x, y, character) {
    this.x = x;
    this.y = y;

    this.sprite = 'images/' + character + '.png';
};

Player.prototype.update = function() {

};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(key) {
    if (key == 'up') {
        if (this.y - blockHeight >= -blockHeightQuarter) {
            this.y -= blockHeight;
        }
    }
    else if (key == 'down') {
        if (this.y + blockHeight <= blockHeight*5 -blockHeightQuarter) {
            this.y += blockHeight;
        }
    }
    else if (key == 'left') {
        if (this.x - blockWidth >= 0) {
            this.x -= blockWidth;
        }
    }
    else if (key == 'right') {
        if (this.x + blockWidth <= blockWidth*4) {
            this.x += blockWidth;
        }
    }

    console.log('x : ' + this.x + ", y : " + this.y);
};

var player = new Player(0, blockHeight * 5 - blockHeightQuarter,'char-boy');

document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
