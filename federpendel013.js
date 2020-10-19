var canvas = document.getElementById('canvas');var context = canvas.getContext('2d'); var canvas_bg = document.getElementById('canvas_bg');var context_bg = canvas_bg.getContext('2d');var sliderFederkonstante = document.getElementById("federkonstante");
var sliderMasse = document.getElementById("masse");
var sliderErdbeschleunigung = document.getElementById("erdbeschleunigung");var ball;var m = 1;var D;  			// Federkonstante
var r;var center = new Vector2D(canvas_bg.width / 2, canvas_bg.height / 2);var oldpos; 	// needed for Standard Verlet schemevar olddt;		// as abovevar n = 0;		// as abovevar t0, dt;var force, acc;
var schwerkraft; 
var erdbeschleunigung;
var letzteMausPos = new Vector2D(0, 0);var animId;var grafik;
var aufhaengung = new Vector2D(canvas_bg.width / 2, canvas_bg.height * 0.10);	
var isDragging = false;window.onload = init; function init() {
		ball = new Ball(16,'#4DA6FF',m,0,false,false);	ball.pos2D = new Vector2D(canvas_bg.width * 0.5, canvas_bg.height * 0.75);
	ball.velo2D = new Vector2D(0, 0);	ball.draw(context);// attractor		var attractor = new Ball(5,'#000000');	attractor.pos2D = center;	attractor.draw(context_bg);// end points	var end1 = new Ball(5,'#ff0000');	end1.pos2D = new Vector2D(canvas_bg.width * 0.5, canvas_bg.height * 0.10);				end1.draw(context_bg);	var end2 = new Ball(5,'#ff0000');	end2.pos2D = new Vector2D(canvas_bg.width * 0.5, canvas_bg.height * 0.75);				end2.draw(context_bg);

	
   canvas.addEventListener('mousedown', function () {
      canvas.addEventListener('mousemove',onDrag,false);
      canvas.addEventListener('mouseup',onDrop,false);
   
   }, false);	
		t0 = new Date().getTime(); 
		animFrame();};


function onDrag(evt){
	
	if ((ball.x - evt.clientX)*(ball.x - evt.clientX) + (ball.y - evt.clientY) * (ball.y - evt.clientY) < 3000) {
		//var maus = new Vector2D(mouseX, mouseY);		
		isDragging = true;
		ball.x = (ball.x - evt.clientX) / 3 + evt.clientX;
		ball.y = (ball.y - evt.clientY) / 3 + evt.clientY;
		
	}
}

function onDrop(evt){
	isDragging = false;
	canvas.removeEventListener('mousemove',onDrag,false);
	canvas.removeEventListener('mouseup',onDrop,false);
	ball.velo2D = new Vector2D(0, 0);	
}
function animFrame(){	animId = requestAnimationFrame(animFrame,canvas);	onTimer(); }

function onTimer(){	var t1 = new Date().getTime(); 	dt = 0.001*(t1-t0); 	t0 = t1;	if (dt>0.2) {dt=0;};	
	D = sliderFederkonstante.value;
	m = sliderMasse.value;
	g = sliderErdbeschleunigung.value;	move();}function move(){				
	schwerkraft = new Vector2D(0, m * g);
	
	if (isDragging==false){	   RK4(ball);	
	}		
	else {
		
	}		context.clearRect(0, 0, canvas.width, canvas.height);	ball.draw(context);		
   //var radius = 20;

	context.lineWidth = 2;
	context.strokeStyle = "#0088FF"; 
	context.beginPath();
	context.moveTo(canvas.width / 2, canvas_bg.height * 0.10);
	context.lineTo(ball.pos2D.x, ball.pos2D.y);
	context.stroke();
	}

function calcForce(pos){
		force = Forces.spring(D, pos.subtract(center));	
	force = Forces.add([force, schwerkraft]);}	

function getAcc(pos,vel){	calcForce(pos,vel);	return force.multiply(1/m);}

function RK4(obj){				// step 1	var pos1 = obj.pos2D;	var vel1 = obj.velo2D;	var acc1 = getAcc(pos1,vel1); 	// step 2	var pos2 = pos1.addScaled(vel1,dt/2); 	var vel2 = vel1.addScaled(acc1,dt/2);	var acc2 = getAcc(pos2,vel2); 	// step 3	var pos3 = pos1.addScaled(vel2,dt/2); 	var vel3 = vel1.addScaled(acc2,dt/2);	var acc3 = getAcc(pos3,vel3); 	// step 4	var pos4 = pos1.addScaled(vel3,dt); 	var vel4 = vel1.addScaled(acc3,dt);	var acc4 = getAcc(pos4,vel4); 	// sum vel and acc	var velsum = vel1.addScaled(vel2,2).addScaled(vel3,2).add(vel4);	var accsum = acc1.addScaled(acc2,2).addScaled(acc3,2).add(acc4);	// update particle pos and velo	obj.pos2D = pos1.addScaled(velsum,dt/6);	obj.velo2D = vel1.addScaled(accsum,dt/6);				//acc = accsum.multiply(1/6);}

