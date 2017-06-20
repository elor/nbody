var epsilon = 200;
var sigma = 100;
var energyscale = 10000;

function LennardJones_12_6(dif) {
 // dif = Math.max(dif, sigma / 3);
  return epsilon * 4 * ((Math.pow(sigma / dif, 12)) - (Math.pow(sigma / dif, 6)));
}

function LennardJones_12_6_force(dif) {
 // dif = Math.max(dif, sigma / 3);
  return epsilon * 4 * ((Math.pow(sigma, 12) * Math.pow(dif, -13) * -12) - (Math.pow(sigma, 6) * Math.pow(dif, -7) * -6));
}

function physicsUpdate(balls, timestep, width, height) {
  var vx1 = new Array(0);
  var vy1 = new Array(0);
  var F = new Array(0);
  var vx2 = new Array(0);
  var vy2 = new Array(0);
  for (var i = 0; i < balls.length; i++) {
    vx1[i] = 0;
    vy1[i] = 0;
    for (var j = 0; j < balls.length; j++) {
      if (i == j) {
        continue;
      }

      var bx = balls[i].x - balls[j].x;
      var by = balls[i].y - balls[j].y;
      var di = Math.sqrt(Math.pow(bx, 2) + Math.pow(by, 2));
      F[i] = -LennardJones_12_6_force(di);
      var a = F[i] / balls[i].element.m;
      vx1[i] += bx / di * a;
      vy1[i] += by / di * a;
    }
  }
  for (var i = 0; i < balls.length; i++) {
    var bx2 = balls[i].x + balls[i].vx * timestep + F[i] / (2 * balls[i].element.m) * Math.pow(timestep, 2);
    var by2 = balls[i].y + balls[i].vy * timestep + F[i] / (2 * balls[i].element.m) * Math.pow(timestep, 2);
    vx2[i] = 0;
    vy2[i] = 0;
    for (var j = 0; j < balls.length; j++) {
      if (i == j) {
        continue;
      }
      var bx2j = balls[j].x + vx1[j] * timestep + F[j] / (2 * balls[j].element.m) * Math.pow(timestep, 2);
      var by2j = balls[j].y + vy1[j] * timestep + F[j] / (2 * balls[j].element.m) * Math.pow(timestep, 2);
      var bx = bx2 - bx2j;
      var by = by2 - by2j;
      var di = Math.sqrt(Math.pow(bx, 2) + Math.pow(by, 2));
      var F2 = -LennardJones_12_6_force(di);
      var a = F2 / balls[i].element.m;
      vx2[i] += bx / di * a;
      vy2[i] += by / di * a;
    }
    balls[i].vx += (vx1[i] / 2 + vx2[i] / 2) * timestep;
    balls[i].vy += (vy1[i] / 2 + vy2[i] / 2) * timestep;
    balls[i].x += balls[i].vx * timestep;
    balls[i].y += balls[i].vy * timestep;

    if (balls[i].x + balls[i].element.r > width && balls[i].vx > 0) {
      balls[i].vx = -balls[i].vx;
    }
    if (balls[i].x - balls[i].element.r < 0 && balls[i].vx < 0) {
      balls[i].vx = -balls[i].vx;
    }

    if (balls[i].y + balls[i].element.r > height && balls[i].vy > 0) {
      balls[i].vy = -balls[i].vy;
    }
    if (balls[i].y - balls[i].element.r < 0 && balls[i].vy < 0) {
      balls[i].vy = -balls[i].vy;
    }
  }
}

function getPotentialEnergy(balls) {
  var energy = 0;
  for (var i = 0; i < balls.length; i++) {
    var Phi = 0;
    for (var j = 0; j < balls.length; j++) {
      if (i == j) {
        continue;
      }
      var bx = balls[i].x - balls[j].x;
      var by = balls[i].y - balls[j].y;
      var di = Math.sqrt(Math.pow(bx, 2) + Math.pow(by, 2));
      Phi += LennardJones_12_6(di) / 2;
    }
    energy += Phi * balls[i].element.m;
  }

  return energy / energyscale;
}

function getKineticEnergy(balls) {
  var energy = 0;
  for (var i = 0; i < balls.length; i++) {
    var v2 = Math.pow(balls[i].vx, 2) + Math.pow(balls[i].vy, 2);
    energy += 0.5 * v2 * balls[i].element.m;
  }

  return energy / energyscale;
}

function getTemperature(balls) {
  var energy = getKineticEnergy(balls) + getPotentialEnergy(balls);
  var energyDurch = energy / balls.length;
  var Boltzmann = 1.38064852 * Math.pow(10, -2);    //1.38064852*10**-23
  var Temp = energyDurch / Boltzmann / 3 * 2;
  return Temp;
}

function holdEnergy(balls, energy, targetenergy) {
  if (balls.length > 1) {
    if (energy > 0) {
      for (var i = 0; i < balls.length; i++) {
        var v = Math.sqrt(Math.pow(balls[i].vy, 2) + Math.pow(balls[i].vx, 2));
        var Phi = 0;
        for (var j = 0; j < balls.length; j++) {
          if (i == j) { } else {
            var bx = balls[i].x - balls[j].x;
            var by = balls[i].y - balls[j].y;
            var di = Math.sqrt((bx, 2) + Math.pow(by, 2));
            Phi += LennardJones_12_6(di);
          }
        }
        var aender = Math.sqrt(targetenergy * energyscale - Phi) / Math.sqrt(energy * energyscale - Phi);
      }
      for (var i = 0; i < balls.length; i++) {
//        var aenderx = (balls[i].vx - balls[i].vx * aender) * 0.001;
//        var aendery = (balls[i].vy - balls[i].vy * aender) * 0.001;
        balls[i].vx = balls[i].vx - (balls[i].vx - balls[i].vx * aender) * 0.001;
        balls[i].vy = balls[i].vy - (balls[i].vy - balls[i].vy * aender) * 0.001;
      }
    }
  }
}

function holdTemperature(balls, temperature, targettemperature) {
}

function physicsUpdateOld(balls, timestep, width, height) {
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