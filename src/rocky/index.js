
// basic analog pebble watchface

//================================
//Require:

var rocky = require('rocky');

//================================
//Functions:

function fractionToRadian(fraction) {
	return fraction * 2 * Math.PI;
}

function drawHand(ctx, cx, cy, angle, length, color, hand) {
	var x2 = cx + Math.sin(angle) * length;
	var y2 = cy - Math.cos(angle) * length;
	chooseWidth(ctx, hand);
	ctx.strokeStyle = color;
	ctx.beginPath();
	ctx.moveTo(cx, cy);
	ctx.lineTo(x2, y2);
	ctx.stroke();
}

function chooseWidth(ctx, hand) {
	switch(hand) {
		case "second":
			ctx.lineWidth = 4;
			break;
		case "minute":
			ctx.lineWidth = 6;
			break;
		case "hour":
			ctx.lineWidth = 8;
			break;
	}
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
	var secondFraction = (d.getSeconds()) / 60;
	var secondAngle = fractionToRadian(secondFraction);
	var minuteFraction = (d.getMinutes()) / 60;
	var minuteAngle = fractionToRadian(minuteFraction);
	var hourFraction = (d.getHours() % 12 + minuteFraction) / 12;
	var hourAngle = fractionToRadian(hourFraction);
	ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);
	drawHand(ctx, cx, cy, secondAngle, maxLength, "white", "second");
	drawHand(ctx, cx, cy, minuteAngle, maxLength, "red", "minute");
	drawHand(ctx, cx, cy, hourAngle, maxLength * 0.6, "red", "hour");
});

rocky.on('secondchange', function(event) {
	rocky.requestDraw();
});
