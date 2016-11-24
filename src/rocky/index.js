//================================
//Variables:

var rocky = require("rocky");
var handColor = "blue";

//================================
//Functions:

function fractionToRadian(fraction) {
	return fraction * 2 * Math.PI;
}

function drawLine(ctx, x1, y1, x2, y2) {
	ctx.beginPath();
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.stroke();
}

function drawHand(ctx, cx, cy, angle, length, width) {
	var x = cx + Math.sin(angle) * length;
	var y = cy - Math.cos(angle) * length;
	
	ctx.lineWidth = width;
	ctx.strokeStyle = handColor;
	drawLine(ctx, cx, cy, x, y);
	
	if (width === 10) {
		ctx.lineWidth = 3;
		ctx.strokeStyle = "black";
		drawLine(ctx, cx, cy, x, y);
	}
}

function drawTick(ctx, ex, ey, angle, length, color) {
	var x = ex - Math.sin(angle) * length;
	var y = ey + Math.cos(angle) * length;
	
	ctx.lineWidth = 5;
	ctx.strokeStyle = color;
	drawLine(ctx, ex, ey, x, y);
}

function drawText(ctx, x, y, text) {
	ctx.fillStyle = "white";
	ctx.textAlign = "center";
	ctx.font = "18px bold Gothic";
	ctx.fillText(text, x, y);
}

function drawCenter(ctx, cx, cy) {
	ctx.fillStyle = handColor;
	ctx.rockyFillRadial(cx, cy, 0, 4, 0, 2 * Math.PI);
}

//================================
//Run:

rocky.on("draw", function(event) {
	var ctx = event.context;
	var d = new Date();
	var w = ctx.canvas.unobstructedWidth;
	var h = ctx.canvas.unobstructedHeight;
	var cx = w / 2;
	var cy = h / 2;
	var maxLength = (Math.min(w, h) - 10) / 2;
	var minuteFraction = (d.getMinutes()) / 60;
	var minuteAngle = fractionToRadian(minuteFraction);
	var hourFraction = (d.getHours() % 12 + minuteFraction) / 12;
	var hourAngle = fractionToRadian(hourFraction);
	
	ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);
	
	for (var ii = 0; ii < 360; ii += 10) {
		var angle = fractionToRadian(ii / 360);
		var x = cx + Math.sin(angle) * maxLength;
		var y = cy - Math.cos(angle) * maxLength;
		if (ii % 30 === 0) {
			drawTick(ctx, x, y, angle, maxLength * 0.1, "lightgrey");
		} else {
			drawTick(ctx, x, y, angle, maxLength * 0.05, "darkgrey");
		}
	}
	
	drawText(ctx, cx, maxLength * 0.4, d.getDate().toString());
	
	drawHand(ctx, cx, cy, minuteAngle, maxLength * 0.8, 7);
	
	drawHand(ctx, cx, cy, hourAngle, maxLength * 0.5, 10);
	
	drawCenter(ctx, cx, cy);
});

rocky.on("minutechange", function(event) {
	rocky.requestDraw();
});
