var energyscale = 10000;
var Boltzmann = 1.38064852 * Math.pow(10, -1);    //1.38064852*10**-23

function LennardJones_9_6(dif, sigma, epsilon) {
 dif = Math.max(dif, sigma / 2);
  return epsilon * 4 * ((Math.pow(sigma / dif, 9)) - (Math.pow(sigma / dif, 6)));
}

function LennardJones_9_6_force(dif, sigma, epsilon) {
 dif = Math.max(dif, sigma / 2);
  return epsilon * 4 * ((Math.pow(sigma, 9) * Math.pow(dif, -10) * -9) - (Math.pow(sigma, 6) * Math.pow(dif, -7) * -6));
}

function LennardJones_12_6(dif, sigma, epsilon) {
 dif = Math.max(dif, sigma / 2);
  return epsilon * 4 * ((Math.pow(sigma / dif, 12)) - (Math.pow(sigma / dif, 6)));
}

function LennardJones_12_6_force(dif, sigma, epsilon) {
 dif = Math.max(dif, sigma / 2);
  return epsilon * 4 * ((Math.pow(sigma, 12) * Math.pow(dif, -13) * -12) - (Math.pow(sigma, 6) * Math.pow(dif, -7) * -6));
}
 
function physicsUpdate(balls, timestep, width, height, targetpotential, sstark, estark) {
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
      var sigma = (balls[i].element.r + balls[j].element.r) * sstark;
      var bx = balls[i].x - balls[j].x;
      var by = balls[i].y - balls[j].y;
      var di = Math.sqrt(Math.pow(bx, 2) + Math.pow(by, 2));
      var epsilon = (balls[i].element.reakt + balls[j].element.reakt) * estark;
      switch (targetpotential) {
        case 'len9_6':
          F[i] = -LennardJones_9_6_force(di, sigma, epsilon);
          break;
        case 'len12_6': 
          F[i] = -LennardJones_12_6_force(di, sigma, epsilon);         
          break;
        default:
          console.error('targetpotential' + ' not defined');
      }    
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
      var sigma = (balls[i].element.r + balls[j].element.r) * sstark;
      var epsilon = (balls[i].element.reakt + balls[j].element.reakt) * estark;
      var bx2j = balls[j].x + vx1[j] * timestep + F[j] / (2 * balls[j].element.m) * Math.pow(timestep, 2);
      var by2j = balls[j].y + vy1[j] * timestep + F[j] / (2 * balls[j].element.m) * Math.pow(timestep, 2);
      var bx = bx2 - bx2j;
      var by = by2 - by2j;
      var di = Math.sqrt(Math.pow(bx, 2) + Math.pow(by, 2));     
      switch (targetpotential) {
        case 'len9_6': var F2 = -LennardJones_9_6_force(di, sigma, epsilon);
          break;
        case 'len12_6': var F2 = -LennardJones_12_6_force(di, sigma, epsilon);         
          break;
        default:
          console.error('targetpotential' + ' not defined');
      }    
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
      if (balls[i].x + balls[i].element.r  > width) {
        balls[i].x = width - balls[i].element.r;
      }
    
    if (balls[i].x - balls[i].element.r < 0 && balls[i].vx < 0) {
      balls[i].vx = -balls[i].vx;
    }
      if (balls[i].x - balls[i].element.r  < 0) {
        balls[i].x = 0 + balls[i].element.r;
      }
    

    if (balls[i].y + balls[i].element.r > height && balls[i].vy > 0) {
      balls[i].vy = -balls[i].vy;
    }
      if (balls[i].y + balls[i].element.r  > height) {
        balls[i].y = height - balls[i].element.r;
      }
    
    if (balls[i].y - balls[i].element.r < 0 && balls[i].vy < 0) {
      balls[i].vy = -balls[i].vy;
    }
    if (balls[i].y - balls[i].element.r  < 0) {
      balls[i].y = 0 + balls[i].element.r;
    }
    
  }
}

function getPotentialEnergy(balls, targetpotential, sstark, estark) {
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
      var sigma = (balls[i].element.r + balls[j].element.r) * sstark;
      var epsilon = (balls[i].element.reakt + balls[j].element.reakt)/2 * estark;
      switch (targetpotential) {
        case 'len9_6': 
          Phi = Phi + LennardJones_9_6(di, sigma, epsilon) / 2;
          break;
        case 'len12_6': 
          Phi = Phi + LennardJones_12_6(di, sigma, epsilon) / 2;         
          break;
        default:
          console.error('targetpotential' + ' not defined');
      }    
    }
    energy += Phi * balls[i].element.m;
  }
  return energy / energyscale;
}
function getPressure(balls, temperature, width, height) {

  var Pressure = balls.length * Boltzmann * temperature / (width * height)*10000;


  return Pressure;
}

function getKineticEnergy(balls) {
  var energy = 0;
  for (var i = 0; i < balls.length; i++) {
    var v2 = Math.pow(balls[i].vx, 2) + Math.pow(balls[i].vy, 2);
    energy += 0.5 * v2 * balls[i].element.m;
  }

  return energy / energyscale;
}
function getroh(balls, width, height) {
  var A = width*height/10000;
  var roh = 0;
  for (var i = 0; i < balls.length; i++) {
    roh +=balls[i].element.m;
  }    
  return roh/A;
}

function getTemperature(balls) {
  var energy = getKineticEnergy(balls);
  var energyDurch = energy / balls.length;
  var Temp = energyDurch / Boltzmann / 3 * 2;
  return Temp;
}

function holdTemperature(balls, temperature, targettemperature, aetime, timestep) {
  if (targettemperature >= 0){
    var kinenergy = temperature * Boltzmann * 3 / 2;
    var targetkinengergy = targettemperature * Boltzmann * 3 / 2;
    if (kinenergy > 0) {
      if (aetime > 0) {
        var aender = Math.sqrt(targetkinengergy * energyscale)/Math.sqrt(kinenergy * energyscale)-1;
        var gesch = timestep / aetime; 
        for (var i = 0; i < balls.length; i++) {
          balls[i].vx += balls[i].vx * aender * gesch;
          balls[i].vy += balls[i].vy * aender * gesch;
        }
      }
    }
  }
}

function holdEnergy(balls, energy, targetenergy, aetime, timestep, targetpotential, sstark, estark) {
  if (targetenergy >= 0){
    var pot = getPotentialEnergy(balls, targetpotential, sstark, estark);
    var kin = getKineticEnergy(balls);
    if (kin > 0) {
      if (aetime > 0) {
        var aender = Math.sqrt(targetenergy*energyscale-pot)/Math.sqrt(energy*energyscale-pot)-1;
        var gesch = timestep / aetime; 
        for (var i = 0; i < balls.length; i++) {
          balls[i].vx += balls[i].vx * aender * gesch;
          balls[i].vy += balls[i].vy * aender * gesch;
        }
      }
    } 
  }   
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