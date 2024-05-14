class Controls extends Phaser.Scene {
    constructor() {
        super("Controls");
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
        this.load.image('background2', "background2.png");
        this.load.image('EXIT', "EXIT.png");
        this.load.image('A', "A.png");
        this.load.image('D', "D.png");
        this.load.image('COLON', "COLON.png");
        this.load.image('SPACELEFT', "SL.png");
        this.load.image('SPACEMID', "SM.png");
        this.load.image('SPACERIGHT', "SR.png");
    }

    create() {
        let my = this.my;   // create an alias to this.my for readability
        my.sprite.background = this.add.sprite(400, 400, "background2");
        my.sprite.EXIT = this.add.sprite(400, 500, "EXIT").setInteractive();
        my.sprite.EXIT.on('pointerdown', this.goToMainScene, this);

        my.sprite.A = this.add.sprite(355, 240, "A");
        my.sprite.D = this.add.sprite(410, 240, "D");
        my.sprite.SPACELEFT = this.add.sprite(345, 300, "SPACELEFT");
        my.sprite.SPACEMID = this.add.sprite(380, 300, "SPACEMID");
        my.sprite.SPACERIGHT = this.add.sprite(425, 300, "SPACERIGHT");
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