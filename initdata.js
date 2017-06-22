const element0 = {
  r: 20,
  m: 2,
  reakt: 10,
  color: 'blue'
};

const ball0 = {
  x: 300,
  y: 100,
  vx: 0,
  vy: 0,
  element: element0
};

function initdata() {
  var el0 = Object.assign({}, element0);
  var el1 = Object.assign({}, element0, { r: 15, m: 1.5, reakt: 6, color: 'yellow' });
  var el2 = Object.assign({}, element0, { r: 10, m: 1, reakt: 2, color: 'red' });
  return {
    elements: [el0, el1, el2],
    balls: [
      Object.assign({}, ball0, { element: el0, vy: -100, y:500 })
    ],
    g: 9.81,
    width: 600,
    height: 600,
    framesPerSecond: 60,
    updatesPerFrame: 10,
    time: 0,
    selectedElement: 0,
    pause: false,
    targettemperature: 20,
    targetenergy: 20,
    aetime: 2,
    targetmode: "none",
    targetpotential: "len9_6",
    sstark: 1,
    estark: 1,
    chartdata: {
      times: new Array(100).map(() => 0),
      energies: new Array(100).map(() => 0),
      potentials: new Array(100).map(() => 0),
      kinetics: new Array(100).map(() => 0),
      temperatures: new Array(100).map(() => 0),
      nextUpdate: 0
    }
  };
}
