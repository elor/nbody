$(function($){
	var $x, $vx, $t, $ball, $plot, $y, $vy, $balls, x, y, vy, vx, g, t, interval, date, width, height, ballsize,friction, bounce, state;

	$x = $('#x');
	$vx = $('#vx');
        $t = $('#time');
        $y = $('#y');
	$vy = $('#vy');

	$plot = $('#plot');
	$ball = $('<div>');
	$plot.append($ball);

	ballsize = $ball.width() / 100;
	width = $plot.width() / 100;
	height = $plot.height() / 100;
	
	x = 2.25;
	vx = 1;
        y = 4;
        vy = 4;

	state = [x, vx, y, vy];
	$balls = [$ball];

	friction = 0.99;
        bounce = 0.9;
        g = -9.81;
        t = 0;

	interval = undefined;	

	function update(){
		var newdate, dt, ballid;
		
		newdate = (new Date()).getTime();
		dt = (newdate - date) / 1000;
		date = newdate;

		for (ballid = 0; ballid < $balls.length; ballid += 1) {
			selectBall(ballid);
			collisionCheck();

			y = y + dt* vy;
	                vy= vy +dt * g;
			x = x + dt * vx;
	                t = t + dt;

			saveBall(ballid);
		}

		displayUpdate();
	}

	function collisionCheck() {
		collisionCheckTop();
		collisionCheckBottom();
		collisionCheckLeft();
		collisionCheckRight();
	}

	function collisionCheckBottom() {
		if (y < 0) {
			vx = vx * friction;
			vy = -vy * bounce;
			y = 0;

			if (vy < 0.6) {
				vy = 0;
			}
			
		}
	}


	function collisionCheckTop() {
		if (height < y + ballsize) {
			vy = -vy * bounce;
			y = width - ballsize;
			vx = vx * friction;
		}
        }


	function collisionCheckRight() {
		if (width < x + ballsize) {
			vx = -vx * bounce;
			x = width - ballsize;
			vy = vy * friction;
		}
	}

	function collisionCheckLeft() {
		if (x < 0) {
			vx = -vx * bounce;
			x = 0;
			vy = vy * friction;
		}
	}


	function displayUpdate() {
		for (ballid = 0; ballid < $balls.length; ballid += 1) {
			selectBall(ballid);

			setPosition($ball, 100 * x, 100 * y);
		}

		selectBall(0);

	        $x.val(x);
	        $vx.val(vx);
	        $t.val(t);
		$y.val(y);
	        $vy.val(vy);
	}

	function setPosition($obj, x, y) {
		$obj.css('left', x);
		$obj.css('top', 500-y);
	}

	function selectBall(index) {
		var offset;
		offset = 4*index;
		$ball = $balls[index];
		x = state[offset];
		vx = state[offset+1];
		y = state[offset+2];
		vy = state[offset+3];
	}

	function saveBall(index) {
		var offset;
		offset = 4*index;
		state[offset] = x;
		state[offset+1] = vx;
		state[offset+2] = y;
		state[offset+3] = vy;
	}

	$x.change(function(e){
		x= Number($x.val());
 		displayUpdate();
		
	});

	$vx.change(function(e){
		vx= Number($vx.val());
		displayUpdate();
	});

	$('#start').click(function(e){
		// simulation starten, wenn sie noch nicht läuft
		if (interval === undefined) {
			date = (new Date()).getTime();
			interval = window.setInterval(update, 1);
		}
		e.preventDefault();
		return false;
	});

	$('#stop').click(function(e){
		// simulation stoppen
	        if (interval !== undefined){
			window.clearInterval(interval);
			interval = undefined;
		}
		e.preventDefault();
		return false;
	});

	$plot.click(function(e) {
		var $newball;
		$newball = $('<div>');

		$balls.push($newball);
		$plot.append($newball);
		state.push(e.offsetX / 100 - ballsize/2);
		state.push(20*Math.random() - 10);
		state.push(height - e.offsetY / 100 - ballsize/2);
		state.push(20*Math.random() - 10);

		displayUpdate();
	});

	$('#friction').change(function(e) {
		friction = Number($(this).val());
	}).val(friction);

	$('#bounce').change(function(e) {
		bounce = Number($(this).val());
	}).val(bounce);

	displayUpdate();
});