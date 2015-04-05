'use strict';

function Grid(cols, rows, div) {
	this.worldWidth = cols;
	this.worldHeight = rows;
	this.things = [];
	this.foodTimer = 0;
	this.FOOD_DROP_INTERVAL = 5; // in seconds

	var table = document.createElement('table');

	this.setup = function() {
		for(var r=0; r<rows; r++) {
			var row = table.insertRow(-1);
			for(var c=0; c<cols; c++) {
				var cell = row.insertCell(-1);
				cell.innerHTML = c + '-' + r;
			}
		}

		this.reset();

		div.innerHTML = '';
		div.appendChild(table);
	};


	this.reset = function() {
		for(var r=0; r<rows; r++) {
			for(var c=0; c<cols; c++) {
				var cell = table.rows[r].cells[c];
				cell.innerHTML = '<div></div>';
				cell.style.outline = 'none';
				cell.style.backgroundColor = 'transparent';
				cell.style.fontSize = '8px';
				cell.style.fontWeight = '100';
			}
		}

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

		this.eachThing(function(food) {
			var cell = table.rows[food.pos.y].cells[food.pos.x];
			cell.innerHTML = '<div>*</div>';
			cell.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
			cell.style.fontSize = '10px';
			cell.style.fontWeight = '400';
		}, Food);

		this.eachThing(function(agent) {
			var cell = table.rows[agent.targetPos.y].cells[agent.targetPos.x];
			cell.style.outline = 'thin solid ' + agent.colour;
			cell.style.fontSize = '10px';
			cell.style.fontWeight = '400';

			cell = table.rows[agent.pos.y].cells[agent.pos.x];
			cell.style.backgroundColor = agent.colour;
			cell.style.fontSize = '12px';
			cell.style.fontWeight = '400';

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