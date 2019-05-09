// Colin Snyder CMPM120 Endless Runner
// For this game I did all of the art assets
// I'm especially proud of the Game Over image
// Uses a prefab to make medkits fall from the background
var game = new Phaser.Game(400, 900, Phaser.AUTO);
var score = 0; //adding score
var scoreText;//a visual display of score
var background;
var timer;
var spikeType;
var spike;
var Difficulty;
var MainMenu = function(game) {};// initializing the MainMenu state
MainMenu.prototype = {
	preload: function() { //loads assets before running the game
		// preload assets
		game.load.image('background', 'assets/img/Background.png');
		game.load.image('spikeOne', 'assets/img/Spikes 1(65x25).png');
		game.load.image('spikeTwo', 'assets/img/Spikes 2.png');
		game.load.image('mainMenu', 'assets/img/Main Menu.png');
		game.load.image('gameOver', 'assets/img/Game Over(400x900).png')
		game.load.atlas('player', 'assets/img/Player.png', 'assets/img/sprites.json');
		// audio recorded by Mike Koenig
		game.load.audio('impact', 'assets/audio/Jab-SoundBible.com-1806727891.mp3');// Found the audio here: http://soundbible.com/995-Jab.html
		game.load.audio('moan', 'assets/audio/Zombie Stabbed-SoundBible.com-1791169971.mp3');// Found the audio here: http://soundbible.com/1038-Zombie-Stabbed.html
		//Song by Razor5 here: https://freesound.org/people/Razor5/sounds/462583/
		game.load.audio('Loop', 'assets/audio/SongLoop.mp3');
	},
	create: function(){
		var background = game.add.sprite(0, 0, 'mainMenu');//places a background
		//Instructions on how to Start the Game are in the art
		Loop = game.add.audio('Loop');
	},
	update: function(){//checks for input then starts the game
		if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
			game.state.start('Play');
		}

	}


}
var platforms;
var Play = function(game){} //initializing the Play state
Play.prototype = {
	init: function(){//initialize score each time you enter the play state
		score = 0;
		timer = 0;
		spikeType = 1;
		Difficulty = 1;
	},
	preload: function(){},
	create: function() { //places sprites or other assets on the screen
		// place your assets
		starscollected = 0;
		this.impact = game.add.audio('impact');
		game.physics.startSystem(Phaser.Physics.ARCADE);//adds game physics
		background = game.add.tileSprite(0,0, 400, 900, 'background');//places a background
		//making a player
		player = game.add.sprite(200, 75, 'player', 'fall');
		player.scale.setTo(1.5,1.5);
		game.physics.arcade.enable(player);//adds game physics to the player
		player.body.collideWorldBounds = true;
		player.animations.add('right', ['rightFall'], 10, true, false);//player animations from texture atlas
		player.animations.add('left', ['leftFall'], 10, true, false);
		//making some keybinds
		cursors = game.input.keyboard.createCursorKeys();
		Spikes = game.add.group();
		// makes the score show up
		scoreText = game.add.text(16, 16, 'score: 0', { fontsize: '32px', fill: '#FFF'})
		//adding looping song
		Loop.play('',0,1,true);
		Loop.volume = 0.05;
	},

	update: function() { // refreshes as the game goes on to update assets and variables
						// run game loop
		scoreText.text = 'score: ' +  score;
		//Movement
		// stops the character from moving horizontally
		player.body.velocity.x = 0;
		if (cursors.left.isDown){ // makes the character run left
			player.body.velocity.x = -150;
			player.animations.play('left');
		}
		else if (cursors.right.isDown){ // makes the character run towards the right
			player.body.velocity.x = 150;
			player.animations.play('right');
		}
		else{  //HALT CITIZEN!!!
			player.animations.stop();
			player.frame = 0;
		}
		//background moving
		background.tilePosition.y -= 2;
		
		//spike collision
		game.physics.arcade.overlap(player, Spikes, die, null, this);
		console.log(timer);
		console.log(spikeType);
		//timer and obstacle spawn;
		if(timer == 75){
			if(spikeType == 1){
				spike = Spikes.create(game.rnd.integerInRange(30,game.width-30), 890, 'spikeOne');
				game.physics.enable(spike);
				spike.body.immovable = true;
				spike.body.velocity.y = -145 + Difficulty;
				spikeType = 2;
			}
			else {
				spike = Spikes.create(game.rnd.integerInRange(30,game.width-50), 890, 'spikeTwo');
				game.physics.enable(spike);
				spike.body.immovable = true;
				spike.scale.setTo(1.6,1.6)
				spike.body.velocity.y = -120 + (2 * Difficulty);
				spikeType = 1;
			}
			score += 5;
			timer = 0;
			Difficulty ++;

		}
		timer ++;

	}
}

var GameOver = function(game){} //initializing the GameOver state
GameOver.prototype = {
	preload: function() { 
	},
	create: function(){
		var background = game.add.sprite(0, 0, 'gameOver');//places a background
		//displays score
		scoreText = game.add.text(16, 16, 'score: ' + score, { fontsize: '32px', fill: '#FFF'})
		this.moan = game.add.audio('moan');//plays death sound
		this.moan.play('', 0, 1, false);	
	},

	update: function(){//checks for input then starts the game
		if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
			game.state.start('Play');
		}

	}
}



function die (player, spike) {// when a player hits a spike they die
	this.impact.play('', 0 , 1, false);
	game.state.start('GameOver');
}

game.state.add('MainMenu', MainMenu);
game.state.add('Play', Play);
game.state.add('GameOver', GameOver);
game.state.start('MainMenu');
