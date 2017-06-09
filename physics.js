function physicsUpdate(balls, timestep, width, height) {
  balls.forEach(function (ball) {
    ball.x += ball.vx * timestep;
    ball.y += ball.vy * timestep;

    if (ball.x + ball.element.r > width && ball.vx > 0) {
      ball.vx = -ball.vx;
    }
    if (ball.x - ball.element.r < 0 && ball.vx < 0) {
      ball.vx = -ball.vx;
    }

    if (ball.y + ball.element.r > height && ball.vy > 0) {
      ball.vy = -ball.vy;
    }
    if (ball.y - ball.element.r < 0 && ball.vy < 0) {
      ball.vy = -ball.vy;
    }

  });
}

function getEnergy(balls) {
  return -1;
}

function getTemperature(balls) {
  return -1;
}