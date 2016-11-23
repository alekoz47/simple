
//basic analog pebble watchface

//================================
//Require:

var rocky = require("rocky");

//================================
//Functions:

function fractionToRadian(fraction) {
	return fraction * 2 * Math.PI;
}

function drawHand(ctx, cx, cy, angle, length, hand) {
	var x = cx + Math.sin(angle) * length;
	var y = cy - Math.cos(angle) * length;
	
	chooseWidth(ctx, hand);
	ctx.strokeStyle = "red";
	ctx.beginPath();
	ctx.moveTo(cx, cy);
	ctx.lineTo(x, y);
	ctx.stroke();
	
	if (hand === "hour") {
		ctx.lineWidth = 2;
		ctx.strokeStyle = "black";
		ctx.beginPath();
		ctx.moveTo(cx, cy);
		ctx.lineTo(x, y);
		ctx.stroke();
	}
}

function drawTick(ctx, ex, ey, angle, length, color) {
	var x = ex - Math.sin(angle) * length;
	var y = ey + Math.cos(angle) * length;
	
	ctx.lineWidth = 4;
	ctx.strokeStyle = color;
	ctx.beginPath();
	ctx.moveTo(ex, ey);
	ctx.lineTo(x, y);
	ctx.stroke();
}

function drawText(ctx, cx, date, length) {
	ctx.fillStyle = "white";
	ctx.textAlign = "center";
	ctx.font = "18px bold Gothic";
	ctx.fillText(date.getDate().toString(), cx, length);
}

function drawCenter(ctx, cx, cy) {
	ctx.fillStyle = "red";
	ctx.rockyFillRadial(cx, cy, 0, 4, 0, 2 * Math.PI);
}

function chooseWidth(ctx, hand) {
	switch(hand) {
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

rocky.on("draw", function(event) {
	var ctx = event.context;
	var d = new Date();
	var w = ctx.canvas.unobstructedWidth;
	var h = ctx.canvas.unobstructedHeight;
	var maxLength = (Math.min(w, h) - 20) / 2;
	var minuteFraction = (d.getMinutes()) / 60;
	var minuteAngle = fractionToRadian(minuteFraction);
	var hourFraction = (d.getHours() % 12 + minuteFraction) / 12;
	var hourAngle = fractionToRadian(hourFraction);
	
	ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);
	
	var cx = w / 2;
	var cy = h / 2;
	
	var angle = 0;
	for (var ii = 0; ii < 360; ii += 10) {
		angle = fractionToRadian(ii / 360);
		var x = cx + Math.sin(angle) * maxLength;
		var y = cy - Math.cos(angle) * maxLength;
		if (ii % 30 === 0) {
			drawTick(ctx, x, y, angle, maxLength * 0.1, "lightgrey");
		} else {
			drawTick(ctx, x, y, angle, maxLength * 0.05, "darkgrey");
		}
	}
	
	drawText(ctx, cx, d, maxLength * 0.3);
	
	drawHand(ctx, cx, cy, minuteAngle, maxLength * 0.8, "minute");
	
	drawHand(ctx, cx, cy, hourAngle, maxLength * 0.5, "hour");
	
	drawCenter(ctx, cx, cy);
});

rocky.on("minutechange", function(event) {
	rocky.requestDraw();
});
