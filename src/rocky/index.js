
// basic analog pebble watchface

//================================
//Require:

var rocky = require('rocky');

//================================
//Functions:

function fractionToRadian(fraction) {
	return fraction * 2 * Math.PI;
}

function drawHand(ctx, cx, cy, angle, length, color) {
	var x2 = cx + Math.sin(angle) * length;
	var y2 = cy - Math.cos(angle) * length;
	ctx.lineWidth = 8;
	ctx.strokeStyle = color;
	ctx.beginPath();
	ctx.moveTo(cx, cy);
	ctx.lineTo(x2, y2);
	ctx.stroke();
}

//================================
//Run:

rocky.on('draw', function(event) {
	var ctx = event.context;
	var d = new Date();
	var w = ctx.canvas.unobstructedWidth;
	var h = ctx.canvas.unobstructedHeight;
	var cx = w / 2;
	var cy = h / 2;
	var maxLength = (Math.min(w, h) - 20) / 2;
	var minuteFraction = (d.getMinutes()) / 60;
	var minuteAngle = fractionToRadian(minuteFraction);
	var hourFraction = (d.getHours() % 12 + minuteFraction) / 12;
	var hourAngle = fractionToRadian(hourFraction);
	ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);
	drawHand(ctx, cx, cy, minuteAngle, maxLength, "white");
	drawHand(ctx, cx, cy, hourAngle, maxLength * 0.6, "lightblue");
});

rocky.on('minutechange', function(event) {
	rocky.requestDraw();
});
