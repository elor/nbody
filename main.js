$(function($){
      var $ball, $plot, g, t, interval, date, width, height, ballsize, friction, bounce, state, mouse;

    mouse = undefined;

      $plot = $('#plot');
      $ball = $('<div>');
    $plot.append($ball);
      $startball = $('<div>').addClass('guide');
      $endball = $('<div>').addClass('guide');

      ballsize = $ball.width() / 100;
    ballsize2 = ballsize*ballsize;
      width = $plot.width() / 100;
      height = $plot.height() / 100;

    state = [];

    window.State = state

      friction = 0.99;
    bounce = 0.9;
    g = -9.81;
    t = 0;

    date = (new Date()).getTime();

      interval = undefined;    

      function update(){
            var nowdate, dt, steps, i;
            
            nowdate = (new Date()).getTime();

        if (nowdate - date > 30) {
            nowdate = date + 30;
        }

        dt = 0.001;
        for (; date < nowdate; date += dt * 1e3) {
            ballphysics(dt);
        }

            displayUpdate();
      }

    function ballphysics(dt) {
        var rate = new Array(state.length);

        for (i = 0; i < state.length; i += 4) {
            // vx
            rate[i] = state[i+1];
            // ax
            rate[i+1] = 0;
            //vy
            rate[i+2] = state[i+3];
            // ay
            rate[i+3] = g;
            }

        // mutual collisions
        for (i = 0; i < state.length; i += 4) {
            for (j = i+4; j < state.length; j += 4) {
                dx = state[i] - state[j];
                dy = state[i+2] - state[j+2];

                r2 = dx*dx + dy*dy; 
                if (r2 < ballsize2 && r2 > 0) {
                    r = Math.sqrt(r2);
                    F = 100 * (1/r - 1/ballsize);

                    nx = dx / r;
                    ny = dy / r;

                    rate[i+1] += F * nx;
                    rate[j+1] -= F * nx;
                    rate[i+3] += F * ny;
                    rate[j+3] -= F * ny;

                    rate[i+1] -= (1-bounce) * 10 * rate[i];
                    rate[i+3] -= (1-bounce) * 10 * rate[i+2];
                    rate[j+1] -= (1-bounce) * 10 * rate[j];
                    rate[j+1] -= (1-bounce) * 10 * rate[j+2];
                }
            }
        }

        window.Rate = rate

        for (i = 0; i < state.length; i += 1) {
            state[i] += rate[i] * dt
        }
          t = t + dt;

        for (i = 0; i < state.length; i += 4) {
            do {
                collided = false;
                // left / right
                    if (width < state[i+0] + ballsize) {
                          state[i+0] = width - ballsize;
                    if (state[i+1] > 0) {
                              state[i+1] *= -bounce;
                        state[i+3] *= friction;
                    }
                    collided = true;
                    } else if (state[i+0] < 0) {
                    state[i+0] = 0;
                    if (state[i+1] < 0) {
                              state[i+1] *= -bounce;
                              state[i+3] *= friction;
                    }
                    collided = true;
                    }

                    if (height < state[i+2] + ballsize) {
                          state[i+2] = height - ballsize;
                    if (state[i+3] > 0) {
                        state[i+1] *= friction;
                              state[i+3] *= -bounce;
                    }
                    collided = true;
                    } else if (state[i+2] < 0) {
                    state[i+2] = 0;
                    if (state[i+3] < 0) {
                        state[i+1] *= friction;
                              state[i+3] *= -bounce;
                    }
                    if (state[i+3] < 0.6) {
                        vy = 0;
                    }
                    collided = true;
                    }
            } while (collided);
        }
    }

    function randomColor() {
        var r,g,b,norm;
        
        r = Math.random();
        g = Math.random();
        b = Math.random();

        //        norm = Math.sqrt(r*r + g*g + b*b) / 255;
        norm = 1/255;

        r /= norm;
        g /= norm;
        b /= norm;
        
        r = Math.round(r);
        g = Math.round(g);
        b = Math.round(b);

        return '#' + r.toString(16).replace(/^(.)$/, "0$1") + g.toString(16).replace(/^(.)$/, "0$1") + b.toString(16).replace(/^(.)$/, "0$1");
    }


      function displayUpdate() {
        var $balls = $plot.children();
            for (ballid = 0; ballid*4 < state.length; ballid += 1) {
            if (ballid >= $balls.length) {
                $plot.append($ball.clone().css('background-color', randomColor()));
                $balls = $plot.children();
            }
                  setPosition($balls.eq(ballid), 100 * state[ballid*4], 100 * state[ballid*4+2]);
            }

        if (mouse) {
            if (!$startball.parent().length) {
                $plot.append($startball);
            }
            if (!$endball.parent().length) {
                $plot.append($endball);
            }
            setPosition($startball, mouse.fromX, 100*height-mouse.fromY);
            setPosition($endball, mouse.toX, 100*height-mouse.toY);
        } else {
            $startball.detach();
            $endball.detach();
        }
      }

      function setPosition($obj, x, y) {
            $obj.css('left', x);
            $obj.css('top', 100*height-y);
      }

      $('#start').click(function(e){
            // simulation starten, wenn sie noch nicht läuft
            if (interval === undefined) {
                  date = (new Date()).getTime();
                  interval = window.setInterval(update, 1);
            }
            e.preventDefault();
            return false;
      }).click();

      $('#stop').click(function(e){
            // simulation stoppen
          if (interval !== undefined){
                  window.clearInterval(interval);
                  interval = undefined;
            }
            e.preventDefault();
            return false;
      });

      $('#clear').click(function(e){
        state = [];
	$plot.children().detach();
	e.preventDefault();
	return false;
      })

    function addRandomBalls(num, resting) {
        var i;
          for (i = 0; i < num; i += 1) {
            addRandomBall(resting);
        }
    }

    function addRandomBall(resting){
        return addBall({
            pageX: width * Math.random() * 100 + $plot.offset().left,
            pageY: height * Math.random() * 100 + $plot.offset().top,
            shiftKey: resting
        });
    }

    function addBall(e){
        var vx, vy, x, y;

        if (e.ctrlKey) {
            return addRandomBalls(10, e.shiftKey);
        }

        x = e.pageX;
        y = e.pageY;

        if (e.shiftKey) {
            vx = 0;
            vy = 0;
        } else if (mouse) {
            vx = (mouse.toX - mouse.fromX) / 10;
            vy = (mouse.fromY - mouse.toY) / 10;
            x = mouse.fromX;
            y = mouse.fromY;
            mouse = undefined;
        } else {
            vx = 20*Math.random() - 10;
            vy = 20*Math.random() - 10;
        }

            state.push(x / 100 - ballsize/2);
            state.push(vx);
            state.push(height - y / 100 - ballsize/2);
            state.push(vy);

            displayUpdate();
    }

      $plot.click(addBall);

    $plot.on('mousedown', function(e){
        mouse = {
            fromX: e.pageX - $plot.offset().left,
            fromY: e.pageY - $plot.offset().top,
            toX: e.pageX - $plot.offset().left,
            toY: e.pageY - $plot.offset().top
        }
        e.preventDefault();
        return false;
    }).on('mousemove', function(e){
        if (e.buttons & 1) {
            if (mouse) {
                mouse.toX = e.pageX - $plot.offset().left;
                mouse.toY = e.pageY - $plot.offset().top;
            }
            e.preventDefault();
            return false;
        } else {
            mouse = undefined;
        }
    });

      $('#friction').change(function(e) {
            friction = Number($(this).val());
      }).val(friction);

      $('#gravity').change(function(e) {
            g = Number($(this).val());
      }).val(g);

      $('#bounce').change(function(e) {
            bounce = Number($(this).val());
      }).val(bounce);

    addRandomBalls(25);
});
