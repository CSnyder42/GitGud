//Spikes.js
// a Prefab for spikes that the player avoids
function Spikes(game, key, frame, scale) { 
	// making a new sprite
	Phaser.Sprite.call(this, game, game.rnd.integerInRange(16,game.width-16), 890, key, scale);

	// changing the stats like alpha and making the anchor centered
	this.anchor.set(0.5);
	this.scale.setTo(scale,scale);

	// adding physics to the spikes
	game.physics.enable(this);
	this.body.immovable = true;
	this.body.velocity.y = -45;
}
// explicitly define prefab's prototype (Phaser.Sprite) and constructor (Spikes)
Spikes.prototype = Object.create(Phaser.Sprite.prototype);
Spikes.prototype.constructor = Spikes;

// keeps the spikes moving
Spikes.prototype.update = function() {
	this.body.velocity.y = -45;
}                                  