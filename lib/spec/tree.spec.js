describe("Behaviour tree:", function() {
	var succeedingNode = new function() {
		this.evaluate = function() { return BT.NodeStatus.Success; };
	}();

	var failingNode = new function() {
		this.evaluate = function() { return BT.NodeStatus.Failure; };
	}();

	var runningNode = new function() {
		this.evaluate = function() { return BT.NodeStatus.Running; };
	}();

	describe("BT.InverterNode evaluator", function() {
		it("returns success if the child node returns failure", function() {
			var inverter = new BT.InverterNode(succeedingNode);
			expect(inverter.evaluate()).toEqual(BT.NodeStatus.Failure);
		});

		it("returns failure if the child node returns success", function() {
			var inverter = new BT.InverterNode(failingNode);
			expect(inverter.evaluate()).toEqual(BT.NodeStatus.Success);
		});

		it("returns running if the child node returns running", function() {
			var inverter = new BT.InverterNode(failingNode);
			expect(inverter.evaluate()).toEqual(BT.NodeStatus.Success);
		});
	});

	describe("BT.SequenceNode evaluator", function() {
		it("evaluates all succeeding child nodes and returns success", function() {
			var sequencer = new BT.SequenceNode([succeedingNode, succeedingNode]);
			spyOn(succeedingNode, 'evaluate').and.callThrough();
			expect(sequencer.evaluate()).toEqual(BT.NodeStatus.Success);
			expect(succeedingNode.evaluate.calls.count()).toEqual(2);
		});

		it("stops and returns failure if a child node returns failure", function() {
			var sequencer = new BT.SequenceNode([
				succeedingNode,
				failingNode,
				succeedingNode
			]);
			spyOn(succeedingNode, 'evaluate').and.callThrough();
			spyOn(failingNode, 'evaluate').and.callThrough();

			expect(sequencer.evaluate()).toEqual(BT.NodeStatus.Failure);
			expect(succeedingNode.evaluate.calls.count()).toEqual(1);
			expect(failingNode.evaluate.calls.count()).toEqual(1);
		});

		it("stops and returns running if a child node returns running", function() {
			var sequencer = new BT.SequenceNode([
				runningNode,
				succeedingNode,
				failingNode
			]);
			spyOn(runningNode, 'evaluate').and.callThrough();
			spyOn(succeedingNode, 'evaluate').and.callThrough();
			spyOn(failingNode, 'evaluate').and.callThrough();

			expect(sequencer.evaluate()).toEqual(BT.NodeStatus.Running);
			expect(runningNode.evaluate.calls.count()).toEqual(1);
			expect(succeedingNode.evaluate.calls.count()).toEqual(0);
			expect(failingNode.evaluate.calls.count()).toEqual(0);
		});
	});
});