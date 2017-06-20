window.onload = function () {
  var vm = new Vue({
    el: '#app',
    data: initdata(),
    components: {
      'n-ball': NBall,
      'n-element': NElement,
      'n-chart': NChart
    },
    computed: {
      plotsize: function () {
        return {
          width: `${this.width}px`,
          height: `${this.height}px`
        };
      },
      timestep: function () {
        return 1.0 / this.framesPerSecond / this.updatesPerFrame;
      },
      frameinterval: function () {
        return 1.0 / this.framesPerSecond;
      },
      temperature: function () {
        return getTemperature(this.balls);
      },
      energy: function () {
        return this.kinetic + this.potential;
      },
      kinetic: function () {
        return getKineticEnergy(this.balls);
      },
      potential: function () {
        return getPotentialEnergy(this.balls);
      }
    },
    methods: {
      updateFrame: function () {
        for (let i = 0; i < this.updatesPerFrame; i += 1) {
          this.updateOnce();
        }
      },
      updateOnce: function () {
        if (this.pause) {
          return;
        }
        physicsUpdate(this.balls, this.timestep, this.width, this.height);

        this.time += this.timestep;
        if (this.chartdata.nextUpdate <= this.time) {
          this.updateChartData();
          this.chartdata.nextUpdate += 0.05;
        }
      },
      updateChartData: function () {
        this.chartdata.times.shift();
        this.chartdata.energies.shift();
        this.chartdata.kinetics.shift();
        this.chartdata.potentials.shift();
        this.chartdata.temperatures.shift();

        this.chartdata.times.push(this.time.toFixed(2));
        this.chartdata.energies.push(this.energy);
        this.chartdata.kinetics.push(this.kinetic);
        this.chartdata.potentials.push(this.potential);
        this.chartdata.temperatures.push(this.temperature);
      },
      createBall: function (element, x, y, r, vx, vy) {
        var ball = Object.assign({}, ball0);

        ball.x = x || this.width / 2;
        ball.y = y || this.height / 2;
        ball.vx = 0;
        ball.vy = 0;
        ball.element = element && this.elements.length > element ? this.elements[element] : this.elements[0];

        return ball;
      },
      addBall: function (event) {
        this.balls.push(this.createBall(this.selectedElement, event.offsetX, this.height - event.offsetY));
      },
      runSimulation: function () {
        if (this.updateInterval) {
          clearInterval(this.updateInterval);
          this.updateInterval = undefined;
        }

        if (this.framesPerSecond > 0) {
          this.updateInterval = setInterval(() => this.updateFrame(), 1000 * this.frameinterval);
        }
      },
      addElement: function () {
        let newElement = Object.assign({}, element0);
        this.elements.push(newElement);
        this.selectElement(this.elements.indexOf(newElement));
      },
      selectElement: function (index) {
        this.selectedElement = index;
      },
      removeElement: function (index) {
        this.elements.splice(index, 1);
        if (this.selectedElement === index) {
          this.selectElement(index - 1);
        }
      },
      reset: function () {
        Object.assign(this, initdata(), { pause: this.pause });
      }
    },
    watch: {
      frameinterval: function () {
        this.runSimulation();
      },
      selectedElement: function () {
        if (this.selectedElement >= 0) {
          if (this.selectedElement < this.elements.length) {
            this.selectedElement = Math.round(this.selectedElement);
          } else {
            this.selectedElement = this.elements.length - 1;
          }
        } else {
          this.selectedElement = 0;
        }
      }
    },
    mounted: function () {
      this.runSimulation();
    }
  });
};
