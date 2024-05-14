class Credits extends Phaser.Scene {
    constructor() {
        super("Credits");
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
        this.load.image('background3', "background3.png");
        this.load.image('EXIT', "EXIT.png");
        this.load.image('name', "name.png");
    }

    create() {
        let my = this.my;   // create an alias to this.my for readability
        my.sprite.background = this.add.sprite(400, 400, "background3");
        my.sprite.EXIT = this.add.sprite(400, 500, "EXIT").setInteractive();
        my.sprite.EXIT.on('pointerdown', this.goToMainScene, this);
        my.sprite.name = this.add.sprite(400, 250, "name");
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

    goToMainScene() {
        this.scene.start("MainMenu");
    }
}