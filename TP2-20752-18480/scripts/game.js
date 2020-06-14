var config = {
    type: Phaser.AUTO,
    width: 960,
    height: 648,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('sky', 'assets/sky1.png');
    this.load.audio('musica', 'assets/musica.mp3');
    this.load.image('ground', 'assets/platform1.png');
    this.load.image('coin', 'assets/coinGold.png');
    this.load.image('monstro', 'assets/monstro.png');
    this.load.spritesheet('pirata','assets/pirata.png', { frameWidth: 32, frameHeight: 48 });
}

var platforms;
var player;

function create ()
{
    this.add.image(480, 324, 'sky');
    platforms = this.physics.add.staticGroup();
    platforms.create(750, 648, 'ground').setScale(2).refreshBody();
    platforms.create(450, 648, 'ground').setScale(2).refreshBody();
    platforms.create(150, 648, 'ground').setScale(2).refreshBody();
    platforms.create(600, 400, 'ground');
    platforms.create(450, 450, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(850, 220, 'ground');

    this.musica = this.sound.add('musica');

    var musicConfig = {
        mute: false,
        volume: 1,
        loop: true,
        delay: 0,
        seek: 0,
        detune: 0,
        rate: 1

    }

    this.musica.play(musicConfig);

    player = this.physics.add.sprite(100, 450, 'pirata');
    player.displayHeight = 50;
    player.displayWidth = 40;
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('pirata', { start: 4, end: 7 }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'turn',
        frames: [ { key: 'pirata', frame: 0 } ],
        frameRate: 20
    });
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('pirata', { start: 8, end: 11 }),
        frameRate: 10,
        repeat: -1
    });

    player.body.setGravityY(300);
    this.physics.add.collider(player, platforms);
    cursors = this.input.keyboard.createCursorKeys();

    coins = this.physics.add.group({
        key: 'coin',
        repeat: 12,
        setXY: { x: 12, y: 0, stepX: 70 }
    });
    coins.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });
    this.physics.add.collider(coins, platforms);
    this.physics.add.overlap(player, coins, collectCoin,
        null, this);

    scoreText = this.add.text(16, 46, 'Score: 0', {
        fontSize: '32px', fill: '#000' });

    scoreLimit = this.add.text(16, 16, 'Make 3000 points to win the game!', {fontSize: '32px', fill: '#000' });

    monstros = this.physics.add.group();
    this.physics.add.collider(monstros, platforms);
    this.physics.add.collider(player, monstros, hitMonstro, null, this);


}

var scoreLimit;

function update ()
{
    if (cursors.left.isDown)
    {
        player.setVelocityX(-160);
        player.anims.play('left', true);
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(160);
        player.anims.play('right', true);
    }
    else
    {
        player.setVelocityX(0);
        player.anims.play('turn');
    }
    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-530);
    }


}

var score = 0;
var scoreText;

function collectCoin (player, coin)
{
    coin.disableBody(true, true);

    score += 50;
    scoreText.setText('Score: ' + score);

    if (coins.countActive(true) === 0)
    {
        coins.children.iterate(function (child) {
            child.enableBody(true, child.x, 0, true, true);
        });
        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) :
            Phaser.Math.Between(0, 400);
        var monstro = monstros.create(x, 16, 'monstro');
        monstro.displayHeight = 40;
        monstro.displayWidth = 40;
        monstro.frameRate = 20;
        monstro.setBounce(1);
        monstro.setCollideWorldBounds(true);
        monstro.setVelocity(Phaser.Math.Between(-150, 150), 20);
    }

    if(score >= 2000){
        alert("YOU WIN, CONGRATULATIONS!");
        this.scene.restart("default");
        score = 0;
        this.musica.stop();
        this.physics.pause();
    }
}

function hitMonstro (player, monstro)
{
    this.musica.stop();
    this.physics.pause();
    player.setTint(0xff0000);
    player.anims.play('turn');
    gameOver = true;
    this.scene.restart("default");
    score = 0;


}

