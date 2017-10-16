const blockHeight = 83;
const blockWidth = 101;
const blockHeightQuarter = 83/4;

// Enemies our player must avoid
var Enemy = function(x, y) {
    this.x = x;
    this.y = y;

    this.speed = 0;

    this.sprite = 'images/enemy-bug.png';
};

Enemy.prototype.update = function(dt) {
    // console.log(dt);
    this.x++;
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

var allEnemies = [];

myVar = setInterval(function() {
    const row = Math.floor(Math.random() * 3) + 1;
    const yLocation = blockHeight * row - blockHeightQuarter;

    let newEnemy = new Enemy(0, yLocation);

    allEnemies.push(newEnemy);
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
