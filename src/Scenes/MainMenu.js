class MainMenu extends Phaser.Scene {
    constructor() {
        super("MainMenu");
        this.my = {
            sprite: {},
            keys: {}
        };  // Create an object to hold sprite bindings
        this.counter = 0;
        this.scrollSpeed = 1;
        this.backgroundSpeedX = 0;
        this.backgroundSpeedY = 0;
    }

    // Use preload to load art and sound assets before the scene starts running.
    preload() {
        // Assets from Kenny Assets pack "Shape Characters"
        // https://kenney.nl/assets/shape-characters
        this.load.setPath("./assets/");
        this.load.image("START", "START.png"); // Load the bunny asset
        this.load.image('background', "background1.png");
        this.load.image('INFO', "INFO.png");
        this.load.image('CONTROLS', "CONTROLS.png");
    }

    create() {
        let my = this.my;   // create an alias to this.my for readability
        my.sprite.background = this.add.sprite(400, 400, "background");
        my.sprite.START = this.add.sprite(400, 290, "START").setInteractive();
        my.sprite.INFO = this.add.sprite(300, 390, "INFO").setInteractive();
        my.sprite.CONTROLS = this.add.sprite(500, 390, "CONTROLS").setInteractive();

        my.sprite.CONTROLS.on('pointerdown', this.goToControlsScene, this);
        my.sprite.INFO.on('pointerdown', this.goToCreditsScene, this);
        my.sprite.START.on('pointerdown', this.goToGameScene, this);
        my.keys.A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        my.keys.D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    }

    update() {
        let my = this.my;    // create an alias to this.my for readability

        // Since update is called multiple times/second, this.counter acts like
        // a timer, increasing once per clock tick
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
    }

    goToControlsScene() {
        this.scene.start("Controls");
    }
    
    goToCreditsScene() {
        this.scene.start("Credits");
    }

    goToGameScene() {
        this.scene.start("MainGame");
    }
}