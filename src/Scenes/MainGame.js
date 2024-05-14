class MainGame extends Phaser.Scene {
    constructor() {
        super("MainGame");
        this.my = {
            sprite: {},
            keys: {}
        };  // Create an object to hold sprite bindings
        this.counter = 0;
        this.scrollSpeed = 1;
        this.backgroundSpeedX = 0;
        this.backgroundSpeedY = 0;
        this.beams = [];
        this.enemies = [];
        this.enemyBeams = [];
        this.highScore = 0
    }

    // Use preload to load art and sound assets before the scene starts running.
    preload() {
        this.load.setPath("./assets/");
        this.load.image('background4', "background4.png");
        this.load.image('ship', "ship.png");
        this.load.image('beam', "beam.png");
        this.load.image('beam2', "beam2.png");
        this.load.image('enemy1', "enemy1.png");
        this.load.image('enemy2', "enemy2.png");
        this.load.image('enemy3', "enemy3.png");
    }

    create() {
        let my = this.my;   // create an alias to this.my for readability
        my.sprite.background = this.add.sprite(400, 400, "background4");
        my.sprite.ship = this.add.sprite(400, 520, "ship");
        my.sprite.health1 = this.add.sprite(20, 570, "ship");
        my.sprite.health2 = this.add.sprite(60, 570, "ship");
        my.sprite.health3 = this.add.sprite(100, 570, "ship");

        my.keys.A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        my.keys.D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        my.keys.SPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.enemySpawnTimer = this.time.addEvent({
            delay: 1000, // Adjust the delay between spawns (in milliseconds)
            loop: true,
            callback: this.spawnEnemy,
            callbackScope: this
        });

        this.enemyShootTimer = this.time.addEvent({
            delay: 2000, // Adjust the delay between shots (in milliseconds)
            loop: true,
            callback: this.enemyShoot,
            callbackScope: this
        });
    }

    update() {
        let my = this.my;    // create an alias to this.my for readability
        this.counter++;
        if (this.counter % 30 == 0) {
            this.backgroundSpeedX = Phaser.Math.Between(-1, 1);
            this.backgroundSpeedY = Phaser.Math.Between(-1, 1);
        }

        my.sprite.background.x += this.backgroundSpeedX;
        my.sprite.background.y += this.backgroundSpeedY;

        if (my.sprite.background.x <= 0 || my.sprite.background.x >= this.sys.game.config.width) {
            this.backgroundSpeedX *= -1;
        }
        if (my.sprite.background.y <= 0 || my.sprite.background.y >= this.sys.game.config.height) {
            this.backgroundSpeedY *= -1;
        }

        if (this.counter % 2 == 0) {
            if (my.keys.A.isDown && my.sprite.ship.x > 60) {
                my.sprite.ship.x -= 40;
            }
            else if (my.keys.D.isDown && my.sprite.ship.x < 725) {
                my.sprite.ship.x += 40;
            }
        }

        if (Phaser.Input.Keyboard.JustDown(my.keys.SPACE)) {
            this.shootBeam();
        }

        this.beams.forEach(beam => {
            beam.y -= 20; // Adjust beam speed here
            if (beam.y < 0) {
                beam.destroy(); // Destroy beam when it goes off-screen
            }
        });

        
        this.enemies.forEach(enemy => {
            // Check if enemy reached its destination
            if (!enemy.destination || Phaser.Math.Distance.Between(enemy.x, enemy.y, enemy.destination.x, enemy.destination.y) < 10) {
                // Generate a new random destination within the bounds of the map
                enemy.destination = new Phaser.Math.Vector2(
                    Phaser.Math.Between(50, this.sys.game.config.width - 50),
                    Phaser.Math.Between(50, this.sys.game.config.height - 50)
                );
            } else {
                // Move enemy towards its destination
                let angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, enemy.destination.x, enemy.destination.y);
                let velocity = new Phaser.Math.Vector2(Math.cos(angle), Math.sin(angle)).normalize().scale(2); // Adjust the speed here
                enemy.x += velocity.x;
                enemy.y += velocity.y;
            }
        });

        this.beams.forEach(beam => {
            this.enemies.forEach(enemy => {
                if (Phaser.Geom.Intersects.RectangleToRectangle(beam.getBounds(), enemy.getBounds())) {
                    beam.destroy();
                    enemy.destroy();
                    this.updateHighScore(100); // Step 2: Increase high score by 100
                }
            });
        });
    }

    shootBeam() {
        let my = this.my;
        let beam = this.add.sprite(my.sprite.ship.x, my.sprite.ship.y - 20, "beam"); // Adjust position as needed
        this.beams.push(beam); // Add beam to array
    }

    spawnEnemy() {
        if (this.enemies.length < 30) {
            let x = Phaser.Math.Between(50, this.sys.game.config.width - 50);
            let y = Phaser.Math.Between(50, this.sys.game.config.height - 750);
            let randomEnemyIndex = Phaser.Math.Between(1, 3); // Assuming you have three enemy types: enemy1, enemy2, and enemy3
            let enemy = this.add.sprite(x, y, "enemy" + randomEnemyIndex); // Adjust the sprite key based on the index
            this.enemies.push(enemy);
        } else {
            // If 30 enemies have spawned, stop spawning
            this.enemySpawnTimer.remove(false);
        }
    }

    enemyShoot() {
        // Enemy shooting logic
        this.enemies.forEach(enemy => {
            // Check if the enemy is alive before shooting
            if (enemy.active && enemy.visible) {
                if (Phaser.Math.Between(1, 100) <= 10) { // Adjust the probability of shooting (e.g., 10% chance)
                    let enemyBeam = this.add.sprite(enemy.x, enemy.y + 20, "beam2"); // Adjust position and sprite key
                    this.enemyBeams.push(enemyBeam);
        
                    // Adjust enemyBeam properties
                    enemyBeam.lifespan = 3000; // Set lifespan (in milliseconds)
                    let enemyBeamSpeed = 1; // Adjust speed as needed
        
                    // Store initial y position of the beam
                    enemyBeam.initialY = enemy.y + 20;
        
                    // Set a timer to move the enemyBeam downwards
                    this.time.delayedCall(100, () => {
                        this.moveEnemyBeam(enemyBeam, enemyBeamSpeed);
                    });
                }
            }
        });
    }

    moveEnemyBeam(enemyBeam, enemyBeamSpeed) {
        // Move the enemyBeam downwards along the y-axis
        this.tweens.add({
            targets: enemyBeam,
            y: this.sys.game.config.height + 5, // Move beyond the bottom of the screen
            duration: 1000, // Adjust duration as needed
            onComplete: () => {
                // Destroy the enemyBeam when it reaches the bottom of the screen
                enemyBeam.destroy();
            }
        });
    }
    
    updateHighScore(points) {
        this.highScore += points; // Increment high score by the given points
        // Step 3: Display high score on the screen
        if (!this.highScoreText) {
            this.highScoreText = this.add.text(700, 20, 'High Score: ' + this.highScore, { fontFamily: 'Arial', fontSize: 10, color: '#ffffff' });
        } else {
            this.highScoreText.setText('High Score: ' + this.highScore);
        }
    }
}