'use strict';

function Food(grid) {
	this.pos = { x: 0, y: 0 };
	this.quantity = 1;

	this.claim = function(agent) {
		if(!this.claimedBy) {
			this.claimedBy = agent;
		}
	};

	this.update = function(elapsedTime) {
	};

	this.consume = function(time) {
		if(this.claimedBy) {
			var c = time * this.claimedBy.traits.eatingSpeed;
			if(c >= this.quantity) {
				this.consumed = true;
				grid.removeThing(this);
				// here we would also update how hungry the agent isn't
			}
		}
	};
}