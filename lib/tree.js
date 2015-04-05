'use strict';

var BT = BT || {};

BT.NodeStatus = Object.freeze({
	Success: 0,
	Failure: 1,
	Running: 2
});


BT.SucceederNode = function(child) {
	this.evaluate = function(context) {
		child.evaluate(context);
		return BT.NodeStatus.Success;
	};
};

BT.InverterNode = function(child) {
	this.evaluate = function(context) {
		switch(child.evaluate(context)) {
			case BT.NodeStatus.Failure:
				return BT.NodeStatus.Success;
			case BT.NodeStatus.Running:
				return BT.NodeStatus.Running;
			case BT.NodeStatus.Success:
				return BT.NodeStatus.Failure;
		}
	};
};


// a composite that succeeds if all children succeed
BT.SequenceNode = function(children) {
	this.evaluate = function(context) {
		for(var i=0; i<children.length; i++) {
			var child = children[i];
			switch(child.evaluate(context)) {
				case BT.NodeStatus.Failure:
					return BT.NodeStatus.Failure;
				case BT.NodeStatus.Running:
					return BT.NodeStatus.Running;
				case BT.NodeStatus.Success:
				default:
					break;
			}
		}
		// if none of the child nodes fail or are still running, we succeed
		return BT.NodeStatus.Success;
	};
};

// a composite
BT.SelectorNode = function(children) {
	this.init = function(context) {
		children.forEach(function(child) {
			if(child.init) {
				child.init();
			}
		});
	};

	this.evaluate = function(context) {
		for(var i=0; i<children.length; i++) {
			var child = children[i];
			switch(child.evaluate(context)) {
				case BT.NodeStatus.Failure:
					break;
				case BT.NodeStatus.Running:
					return BT.NodeStatus.Running;
				case BT.NodeStatus.Success:
					return BT.NodeStatus.Success;
			}
		}
		// if none of the child nodes succeed or are still running, we fail
		return BT.NodeStatus.Failure;
	};
};


// a decorator
BT.RepeatUntilFailNode = function(child) {
	this.init = function(context) {
		child.init(context);
	};

	this.evaluate = function(context) {
		if(child.evaluate(context) === BT.NodeStatus.Success) {
			// we finished - start again
			child.init(context);
		}
	};
};

