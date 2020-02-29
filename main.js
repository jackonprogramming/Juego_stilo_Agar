var width = "99%";
var height = "99%";


var game = new Phaser.Game(width, height, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update });
var player;
var bg;
var map_size = 2000;
var balls;
var player_size = 1;
var moveBullets;
var colors = ["yellow", "blue", "orange", "pink", "green"];
var minSpeed = 251;


this.game.scale.pageAlignHorizontally = true;
this.game.scale.pageAlignVertically = true;
this.game.scale.refresh();

function preload() {
    game.load.image('background', 'img/grid2.png');
}

function create() {


    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.time.advancedTiming = true;
    game.time.desiredFps = 60; //fps
    game.time.slowMotion = 2.0;

    bg = game.add.tileSprite(0, 0, map_size, map_size, 'background');
    game.world.setBounds(0, 0, map_size, map_size);
    game.stage.backgroundColor = "#fff";

    balls = game.add.group();
    balls.enableBody = true;
    for (var i = 0; i < 30; i++) {
        var rand = Math.floor(Math.random() * 4);
        var bounces = generateCircle(colors[rand], 10);
        var ball = balls.create(game.world.randomX, game.world.randomY, bounces);
    }

    setInterval(function() {
        for (var i = 0; i < 5; i++) {
            var rand = Math.floor(Math.random() * 5);
            var bounces = generateCircle(colors[rand], 10);
            var ball = balls.create(game.world.randomX, game.world.randomY, bounces);
        }
    }, 30000);

    var bmd = generateCircle('red', 20);

    player = game.add.sprite(game.world.centerX, game.world.centerY, bmd);
    game.physics.enable(player, Phaser.Physics.ARCADE);
    player.anchor.setTo(0.5, 0.5);
    game.camera.follow(player);
    player.body.collideWorldBounds = true;



}

function update() {
    /*
    speed = game.physics.arcade.distanceBetween(player,game.input.activePointer)*5;
    game.physics.arcade.moveToPointer(player,speed);
    */



    game.input.addMoveCallback(function() {
        game.physics.arcade.moveToPointer(player, game.physics.arcade.distanceToPointer(player) / 2 + minSpeed);
    });
    game.physics.arcade.collide(player, balls, collisionHandler, processHandler, this);



    if (player.body.onFloor()) {

        player.reset(game.world.centerX, game.world.centerY);

    }

    if (player.body.onWall()) {

        player.reset(game.world.centerX, game.world.centerY);

    }



}

function generateCircle(color, size) {
    var bitmapSize = size * 2
    var bmd = this.game.add.bitmapData(bitmapSize, bitmapSize);
    bmd.ctx.fillStyle = color;
    bmd.ctx.beginPath();
    //bdm.ctx.border = true;
    bmd.ctx.arc(size, size, size, 0, Math.PI * 2, true);
    bmd.ctx.closePath();
    bmd.ctx.fill();
    return bmd;
}

function processHandler(player, ball) {
    return true;
}

function collisionHandler(player, ball) {

    ball.kill();

    if (minSpeed > 10) {
        minSpeed = minSpeed - 10;
    }

    if (player_size < 130) {
        player_size = player_size + 10;
        game.camera.scale.x -= 0.003;
        game.camera.scale.y -= 0.003;
    }

    player.scale.set(1 + player_size / 4 / 10);
    game.physics.arcade.moveToPointer(player, game.physics.arcade.distanceToPointer(player) / 2 + minSpeed);

}
game.scale.setTo(width, height);