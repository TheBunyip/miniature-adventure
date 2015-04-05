'use strict';

function MakeUniqueColours(numColours) {
	var colourTable = [];

	// assumes hue [0, 360), saturation [0, 100), lightness [0, 100)
	for(var i = 100; i < 240; i += (240 - 100) / numColours) {
	    var hue = i;
	    var sat = 90 + Math.random() * 10;
	    var lum = 30 + Math.random() * 10;

	    colourTable.push('hsl(' + hue + ',' + sat + '%,' + lum + '%)');
	}

	return colourTable;
}