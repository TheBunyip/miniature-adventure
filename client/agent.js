'use strict';

function Agent(grid, colour) {
	this.pos = { x: 0, y: 0 };
	this.targetPos = { x: 0, y: 0 };
	this.grid = grid;
	this.colour = colour;

	this.traits = {
		movingSpeed: 3 + (Math.random() * 4) // = num grid cells per second
		eatingSpeed: 1 + (Math.random() * 3) //
	};

	this.genes = {
		speed: 'S'
	};

	this.resetBehaviour = function() {
		// for now just keep moving
		this.behaviourTree = new BT.RepeatUntilFailNode(
			new BT.SelectorNode([
				new BT.SequenceNode([
					new MoveToThing(this, Food),
					new EatFood(this),
				]),
				new WanderBehaviour(this)
			])
		);
		this.behaviourTree.init(grid);
		this.moveTimer = 0;
	};

	this.updateRunningTime = function(behaviourNode, delta) {
		if(this.runningNode !== behaviourNode) {
			this.runningTime = 0;
		}
		this.runningTime = (this.runningTime || 0) + delta;
		this.runningNode = behaviourNode;
	};

	this.think = function(elapsedTime) {
		this.elapsedTime = elapsedTime;
		this.behaviourTree.evaluate(this);
	};

	this.move = function(time) {
		var distance = this.traits.movingSpeed * time; // distance = speed * time
		while(distance >= 1) {
			var xPosOffset = this.targetPos.x - this.pos.x;
			var yPosOffset = this.targetPos.y - this.pos.y;
			if(xPosOffset !== 0 || yPosOffset !== 0) {
				if(Math.abs(xPosOffset) >= Math.abs(yPosOffset)) {
					// move in x
					this.pos.x += xPosOffset / Math.abs(xPosOffset);
				} else {
					// move in y
					this.pos.y += yPosOffset / Math.abs(yPosOffset);
				}
			}
			distance -= 1;
		}
		return distance / this.traits.movingSpeed;
	};

	this.resetBehaviour();
}