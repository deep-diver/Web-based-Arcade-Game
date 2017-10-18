/*
    Constant Variables
*/
const BLOCK_HEIGHT          = 83;                
const BLOCK_WIDTH           = 101;
const BLOCK_HEIGHT_QUARTER  = 83/4; // when to move image slightly up&down

const MAX_STAR              = 5; // maximum number of star (star can be gathered when player reaches the water zone)
const MAX_HP                = 5;
const MAX_ITEM              = 5; // maximum number of items existing in the gaming area
const WATER_REACH_SCORE     = 5; // score that is achievable when player reaches the water zone

const NUM_OF_ROW            = 9; // number of blocks (row)
const NUM_OF_COL            = 6; // number of blocks (column)

const ENEMY_SPAWN_INTERVAL      = 1500; // interval to spawn an enemy (in msec)
const ENEMY_DESTROY_INTERVAL    = 1000; // interval to destroy enemy (in msec)
const ITEM_SPAWN_INTERVAL       = 20000; // interval to spawn an item (in msec) 

const characters = [ // character kinds
    "char-boy",
    "char-cat-girl",
    "char-horn-girl",
    "char-pink-girl",
    "char-princess-girl"
];

const items = { // item kinds
    'Gem Blue': 1,
    'Gem Green': 2,
    'Gem Orange': 3,
    'Key': 4
};

/*
    Enemy Class
    @property
    - x, y      : coordinates
    - speed     : every enemy has different speed (default is 80)
    - sprite    : image path to draw enemy
    @function
    - update    : determine how many pixels to move based on speed per every refreshment rate
    - render    : knows where and what to draw for an enemy
*/
let Enemy = function(x, y) {
    this.x = x;
    this.y = y;
    this.speed = 80;

    this.sprite = 'images/enemy-bug.png';
};

Enemy.prototype.update = function(dt) {
    this.x += this.speed * dt;

    //horizontal collision
    if ((this.x + BLOCK_WIDTH >= player.x) && (this.x < player.x + BLOCK_WIDTH) &&
        (this.y === player.y)) {
        player.hp = player.hp - 1;
        player.x = 0;
        player.y = BLOCK_HEIGHT * (NUM_OF_ROW-1) - BLOCK_HEIGHT_QUARTER;

        allHearts.pop();
    }
};

Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/*
    Star Class
    @property
    - x, y          : coordinates (stars are located on the left side at the bottom)
    - width, height : in order to adjust (shrink) image size
    - sprite        : image path to draw enemy
    @function
    - render        : knows where and what to draw for an star
*/
let Star = function(index) {
    this.x = index * BLOCK_WIDTH/4;
    this.y = BLOCK_HEIGHT * NUM_OF_ROW + BLOCK_HEIGHT_QUARTER*2;

    this.width = BLOCK_WIDTH/4;
    this.height = BLOCK_HEIGHT/2;

    this.sprite = 'images/Star.png';
};

Star.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y, this.width, this.height);
};

/*
    Heart Class
    @property
    - x, y          : coordinates (hearts are located on the right side at the bottom)
    - width, height : in order to adjust (shrink) image size
    - sprite        : image path to draw enemy
    @function
    - constructor
        - arg(@index) : index to determine the y-location of a heart
    - render        : knows where and what to draw for a heart
*/
let Heart = function(index) {
    this.x = (BLOCK_WIDTH * (NUM_OF_COL-1) - BLOCK_WIDTH / 4) + (index * BLOCK_WIDTH / 4);
    this.y = BLOCK_HEIGHT * NUM_OF_ROW + BLOCK_HEIGHT_QUARTER*2;

    this.width = BLOCK_WIDTH/4;
    this.height = BLOCK_HEIGHT/2;

    this.sprite = 'images/Heart.png';
};

Heart.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y, this.width, this.height);
};

/*
    Item Class
    @property
    - x, y          : coordinates 
    - width, height : in order to adjust (shrink) image size
    - sprite        : this property will be set when a new Item is created
                      since randomly selected item will be spwaned.
    @function
    - render        : knows where and what to draw for an item
*/
let Item = function(x, y) {
    this.x = x;
    this.y = y;

    this.width = BLOCK_WIDTH/2;
    this.height = BLOCK_HEIGHT;
};

Item.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y, this.width, this.height);
};

/*
    ScoreText Class
    @property
    - x, y          : coordinates (Score is displayed on the left side at the top)
    - text          : this is String text to be displayed
    @function
    - setScore      : set score text 
      @arg(score)   : String or Number to represent only score

    - render        : knows where to draw text
*/
let ScoreText = function() {
    this.x = 0;
    this.y = BLOCK_HEIGHT;

    this.text = "SCORE: 0";
};

ScoreText.prototype.setScore = function(score) {
    this.text = "SCORE: " + score;
}

ScoreText.prototype.render = function() {
    ctx.font = "30px Arial";
    ctx.fillText(this.text, this.x, this.y);
}

/*
    Player Class
    @property
    - x, y          : coordinates 
    - characterIndex: player can choose a character 
    - character     : chosen character's (image) name 
    - isInitStatus  : true before a user chooses a character
                      false after a user chooses a character
    - star          : how many stars are achieved
    - score         : total score record
    - hp            : heart points (MAX_HP's hearts are added initially)
    - sprite        : image for a character 
    - chooseSprite  : image for a background appearing during character choosing process
    @function
    - update        : check when player has reached the water zone
                      check when player has reached the water zone and achieved MAX_STAR
                      check when player has lost all of HPs
                      check when Player has collected an item (collision)
    - reset         : reset to the initial state
    - render        : draw character
                      draw chooseSprite as a background of a character when isInitStatus is true
    - changeCharacter : get character name, and set it to the sprite
    - handleInput   : when user presses keys (up/down/left/right/enter)
*/
let Player = function(x, y, characterIndex) {
    this.x = x;
    this.y = y;

    this.characterIndex = characterIndex;
    this.character = characters[characterIndex];
    this.isInitStatus = true;

    this.star = 0;
    this.score = 0;
    this.hp = MAX_HP;

    this.sprite = 'images/' + this.character + '.png';
    this.chooseSprite = 'images/Selector.png';

    for (let i = 0; i < this.hp; i++) {
        allHearts.push(new Heart(i));
    }
};

Player.prototype.update = function() {
    // when player reaches water block
    if (this.y <= 0) {
        
        // adding additional star to the list
        allStars.push(new Star(this.star++));

        // add score 
        this.score += WATER_REACH_SCORE;

        // set score to the ScoreText
        scoreText.setScore(this.score);
        
        // move player back to the initial position
        this.x = 0;
        this.y = BLOCK_HEIGHT * (NUM_OF_ROW-1) - BLOCK_HEIGHT_QUARTER;
        
        if (this.star === MAX_STAR) {
            alert("You successfully cleared the game! The Final Score is " + this.score + "!! now, back to the beginning!");
            this.reset();
        }
    }

    if (this.hp === 0) {
        alert("game over!");
        this.reset();
    }

    // when player intersects an item
    for (let i = 0; i < allItems.length; i++) {
        if (allItems[i].x > player.x && 
            allItems[i].x < (player.x + BLOCK_WIDTH) &&
            allItems[i].y > player.y &&
            allItems[i].y < (player.y + BLOCK_HEIGHT)) {
            // what kind of item is it?
            const kind = allItems[i].kind;

            // remove the item from the list
            allItems.splice(i, 1); 
        
            // add score based on the kind of the item
            this.score += items[kind];

            // set score to the ScoreText
            scoreText.setScore(this.score);
        }
    }
};

Player.prototype.reset = function() {
    this.star = 0;
    this.hp = MAX_HP;
    this.score = 0;
    scoreText.setScore(0);

    this.isInitStatus = true;
    this.x = 0;
    this.y = BLOCK_HEIGHT * (NUM_OF_ROW-1) - BLOCK_HEIGHT_QUARTER;

    allHearts = [];
    allEnemies = [];
    
    clearInterval(enemySpawnTimer);
    clearInterval(itemSpawnTimer);
    clearInterval(enemyDestroyTimer);

    enemySpawnTimer = null;
    itemSpawnTimer = null;
    enemyDestroyTimer = null;

    for (let i = 0; i < this.hp; i++) {
        allHearts.push(new Heart(i));
    }

    allStars = [];
};

Player.prototype.render = function() {
    // draw chooseSprite image only at the beginning of the game
    // when a user is choosing character to play with.
    if (this.isInitStatus) {
        ctx.drawImage(Resources.get(this.chooseSprite), this.x, this.y - BLOCK_HEIGHT_QUARTER);
    }

    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.changeCharacter = function(characterIndex) {
    this.characterIndex = characterIndex;
    this.character = characters[characterIndex];
    this.sprite = 'images/' + this.character + '.png';
};

Player.prototype.handleInput = function(key) {
    // when a user has done with choosing a character
    if (!this.isInitStatus) {
        if (key == 'up') {
            if (this.y - BLOCK_HEIGHT >= -BLOCK_HEIGHT_QUARTER) {
                this.y -= BLOCK_HEIGHT;
            }
        }
        else if (key == 'down') {
            if (this.y + BLOCK_HEIGHT <= BLOCK_HEIGHT * (NUM_OF_ROW-1) - BLOCK_HEIGHT_QUARTER) {
                this.y += BLOCK_HEIGHT;
            }
        }
        else if (key == 'left') {
            if (this.x - BLOCK_WIDTH >= 0) {
                this.x -= BLOCK_WIDTH;
            }
        }
        else if (key == 'right') {
            if (this.x + BLOCK_WIDTH <= BLOCK_WIDTH * (NUM_OF_COL-1)) {
                this.x += BLOCK_WIDTH;
            }
        }
    }
    // when a user is in the middle of choosing a character
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
        // enter key makes the game getting started.
        else if (key == 'enter') {
            this.isInitStatus = false;
            initEnemySpawnTimer();
            initItemSpawnTimer();
            initEnemyDestroyTimer();
        }
    }
};

/*
    Timer Creation Helper Functions
*/

// timer to spawn an enemy every ENEMY_SPAWN_INTERVAL msec.
function initEnemySpawnTimer() {
    enemySpawnTimer = setInterval(function() {
        // randomly create number range from 1~5
        // column where enemies are allowed to be spawned. 
        // 1~3 columns, 5~6 columns
        let row = Math.floor(Math.random() * 5) + 1;

        // randomly gereated numbers 4 and 5 are mapped to the columns, 5 and 6
        if (row == 4) row = 5;
        else if (row == 5) row = 6;

        const yLocation = BLOCK_HEIGHT * row - BLOCK_HEIGHT_QUARTER;

        // randomly determine speed range from 80 ~ 300
        const speed = Math.floor(Math.random() * 220) + 80;
        const newEnemy = new Enemy(0, yLocation);
        newEnemy.speed = speed;
        allEnemies.push(newEnemy);
    }, ENEMY_SPAWN_INTERVAL);
};

// timer to spawn an item every ITEM_SPAWN_INTERVAL msec.
function initItemSpawnTimer() {
    itemSpawnTimer = setInterval(function() {
        // pick a random position in x and y
        const rowPixel = Math.floor(Math.random() * NUM_OF_ROW*83) + BLOCK_HEIGHT;
        const colPixel = Math.floor(Math.random() * NUM_OF_COL*101) + BLOCK_WIDTH/4;

        // pick a random item
        const itemKind = Math.floor(Math.random() * Object.keys(items).length)

        // create and add a new Item only when there are less items than MAX_ITEM
        if (itemCount < MAX_ITEM) {
            const newItem = new Item(rowPixel, colPixel);
            newItem.kind = Object.keys(items)[itemKind];
            newItem.sprite = 'images/' + Object.keys(items)[itemKind] + '.png';

            allItems.push(newItem);
            itemCount++;
        }
    }, ITEM_SPAWN_INTERVAL);
};

// timer to destroy enemies ever ENEMY_DESTROY_INTERVAL msec.
function initEnemyDestroyTimer() {
    enemyDestroyTimer = setInterval(function() {
        for (let i = 0; i < allEnemies.length; i++) {
            if (allEnemies[i].x > BLOCK_WIDTH * NUM_OF_COL) {
                allEnemies.splice(i, 1);
            }
        }
    }, ENEMY_DESTROY_INTERVAL);
}

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


/*
    Global Variables
*/
let itemCount               = 0; // how many items have been spawned

let allEnemies              = []; // array to store enemies
let allStars                = []; // array to store stars
let allHearts               = []; // array to store hearts
let allItems                = []; // array to store items

let player                  = new Player(0, BLOCK_HEIGHT * (NUM_OF_ROW-1) - BLOCK_HEIGHT_QUARTER, 0);
let scoreText               = new ScoreText();
let enemySpawnTimer         = null;
let enemyDestroyTimer       = null;
let itemSpawnTimer          = null;
