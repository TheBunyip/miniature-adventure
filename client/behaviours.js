'use strict';

// if a food item is within 2 squares of an agent, move to it
function MoveToThing(agent, typeOfThing) {
	this.description = 'moving to ' + typeOfThing.name;

	this.evaluate = function(context) {
		var self = this;
		var result = agent.grid.eachThing(function(thing) {
			if(context.pos.x == thing.pos.x && agent.pos.y == thing.pos.y) {
				return BT.NodeStatus.Success;
			}
			else if(!thing.claimedBy && grid.thingsAreClose(agent.pos, thing.pos)) {
				agent.targetPos = thing.pos;

				context.updateRunningTime(self, context.elapsedTime);
				context.runningTime = agent.move(context.runningTime);

				return BT.NodeStatus.Running;
			}
		}, typeOfThing);

		return typeof result !== 'undefined' ? result : BT.NodeStatus.Failure;
	};
}

// if a food item is in the same cell as the agent, eat it
function EatFood(agent) {
	this.description = 'eating food';

	this.evaluate = function(context) {
		var self = this;
		var result = agent.grid.eachThing(function(food) {
			if(!food.claimedBy &&
				agent.pos.x == food.pos.x &&
				agent.pos.y == food.pos.y) {
				agent.grid.claimFood(food, agent);
			}
			if(food.claimedBy == agent) {
				context.updateRunningTime(self, context.elapsedTime);
				food.consume(context.runningTime);
				return BT.NodeStatus.Running;
			}
		}, Food);

		return typeof result !== 'undefined' ? result : BT.NodeStatus.Failure;
	};
}

// pick a random place and walk to it
function WanderBehaviour(agent) {
	this.description = 'wandering';

	this.init = function(context) {
		agent.targetPos = agent.grid.getRandomCell();
	};

	this.evaluate = function(context) {
		// QUESTION: who should be responsible for updating the
		// position of the agent?  There are at least two options:
		//  (1) a tick function on the agent, and
		//  (2) this function
		// I like (1) because that keeps the behaviour tree node cleaner.

		// UPDATE: I've since changed my mind on this.  If an update function
		// on the agent does the update then it will inevitably end up
		// performed some checks to determine what the behaviour tree determined
		// it should do (the last time it was evaluated).  This is effectively
		// duplication - state would be set by a node in the tree (e.g. targetPos)
		// and then checked in the agent's update.  Seems to spread responsibility
		// unnecessarily?

		// For now the only criteria for an agent doing the move
		// behaviour is "are we there yet?". In reality this would fail if, for
		// example, we worked out that the way is blocked.
		if(agent.pos.x === agent.targetPos.x &&
			agent.pos.y === agent.targetPos.y) {
			return BT.NodeStatus.Success;
		}
		else {
			context.updateRunningTime(this, context.elapsedTime);
			context.runningTime = agent.move(context.runningTime);
			return BT.NodeStatus.Running;
		}
	};
}