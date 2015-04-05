'use strict';

function Grid(cols, rows, canvas) {
	this.worldWidth = cols;
	this.worldHeight = rows;
	this.things = [];
	this.foodTimer = 0;
	this.FOOD_DROP_INTERVAL = 5; // in seconds

	var renderCtx = null;
	var cellSize = {};

	this.setup = function() {

		renderCtx = canvas.getContext('2d');
		cellSize.x = canvas.width / cols;
		cellSize.y = canvas.height / rows;

		this.reset();
	};


	this.reset = function() {
		renderCtx.clearRect(0, 0, canvas.width, canvas.height);
		if(this.debugTo) {
			this.debugTo.innerHTML = '';
		}
	};

	this.addThing = function(thing) {
		thing.pos = this.getRandomCell();
		this.things.push(thing);
	};

	this.removeThing = function(thing) {
		this.things.splice(this.things.indexOf(thing), 1);
	};

	this.claimFood = function(food, agent) {
		food.claim(agent);
	};

	this.update = function(elapsedTime) {
		// tick agents
		this.eachThing(function(agent) {
			agent.think(elapsedTime);
		}, Agent);

		// tick food
		this.eachThing(function(food) {
			food.update(elapsedTime);
		}, Food);

		this.foodTimer += elapsedTime;
		if(this.foodTimer >= this.FOOD_DROP_INTERVAL) {
			this.foodTimer = 0;
			if(this.countOfThings(Food) < 5) {
				this.addThing(new Food());
			}
		}
	};

	this.render = function() {
		var self = this;
		this.reset();

		renderCtx.fillStyle = 'rgba(0, 0, 0, 0.2)';
		this.eachThing(function(food) {
			renderCtx.fillRect(food.pos.x * cellSize.x, food.pos.y * cellSize.y, cellSize.x, cellSize.y);
		}, Food);

		this.eachThing(function(agent) {
			renderCtx.strokeStyle = agent.colour;
			renderCtx.strokeRect(Math.floor(agent.targetPos.x) * cellSize.x, Math.floor(agent.targetPos.y) * cellSize.y, cellSize.x, cellSize.y);

			renderCtx.fillStyle = agent.colour;
			renderCtx.fillRect(Math.floor(agent.pos.x) * cellSize.x, Math.floor(agent.pos.y) * cellSize.y, cellSize.x, cellSize.y);

			if(self.debugTo) {
				var agentDebugDiv = document.createElement('div');
				agentDebugDiv.className = 'debug';
				agentDebugDiv.style.backgroundColor = agent.colour;
				var text = 'Agent @ (' + agent.pos.x + ',' + agent.pos.y + ')';
				if(agent.runningNode) {
					text += ' ' + agent.runningNode.description;
				}
				agentDebugDiv.innerHTML = text;
				self.debugTo.appendChild(agentDebugDiv);
			}
		}, Agent);
	};

	this.getRandomCell = function() {
		return {
			x: Math.floor(Math.random() * cols),
			y: Math.floor(Math.random() * rows)
		};
	};

	this.thingsAreClose = function(thing1, thing2) {
		return (Math.abs(thing1.x - thing2.x) <= 3 &&
			Math.abs(thing1.y - thing2.y) <= 3);
	};

	this.eachThing = function(callback, type) {
		if(callback) {
			for(var i=0; i<this.things.length; i++) {
				var thing = this.things[i];
				if(!type || thing instanceof type) {
					var results = callback(thing);
					if(typeof results !== 'undefined') {
						return results;
					}
				}
			}
		}
	};

	this.countOfThings = function(type) {
		var count = 0;
		for(var i=0; i<this.things.length; i++) {
			var thing = this.things[i];
			if(!type || thing instanceof type) {
				count++;
			}
		}
		return count;
	};

	this.setup();
}