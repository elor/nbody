const element0 = {
  r: 20,
  m: 1,
  color: 'blue'
};

const ball0 = {
  x: 50,
  y: 50,
  vx: 149,
  vy: 319,
  element: element0
};

function initdata() {
  var el0 = Object.assign({}, element0);
  var el1 = Object.assign({}, element0, { r: 10, m: 2, color: 'red' });

  return {
    elements: [el0, el1],
    balls: [Object.assign({}, ball0, { element: el0 })],
    g: 9.81,
    width: 800,
    height: 800,
    framesPerSecond: 60,
    updatesPerFrame: 10,
    time: 0,
    selectedElement: 0,
    pause: false,
    targettemperature: 20,
    targetenergy: 10
  };
}
