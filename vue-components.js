var NBall = Vue.extend({
  props: ['ball', 'elements'],
  template: '<div class="ball" :style="style"></div>',
  computed: {
    style: function () {
      return {
        backgroundColor: this.ball.element.color,
        left: `${this.ball.x - this.ball.element.r}px`,
        bottom: `${this.ball.y - this.ball.element.r}px`,
        width: `${2 * this.ball.element.r}px`,
        height: `${2 * this.ball.element.r}px`
      };
    }
  }
});

var NElement = Vue.extend({
  props: ['element'],
  template: '<div class="ball element" :style="style"></div>',
  computed: {
    style: function () {
      return {
        backgroundColor: this.element.color,
        width: `${2 * this.element.r}px`,
        height: `${2 * this.element.r}px`
      };
    }
  }
});

var NChart = Vue.extend({
  extends: VueChartJs.Line,
  props: ['xdata', 'ydata', 'title'],
  methods: {
    rerender() {
      if (this._chart) {
        this._chart.update();
      }
    }
  },
  mounted() {
    var colors = ['blue', 'green', 'red'];

    this.renderChart({
      labels: this.xdata,
      datasets: this.ydata.map((data, index) => {
        return {
          label: this.title[index],
          data: data,
          fill: false,
          borderColor: colors[index],
          pointStyle: 'line'
        };
      }),
    },
      {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        legend: {
          fullWidth: true
        }
      }
    );
  },
  watch: {
    ydata() {
      this.rerender();
    }
  }
});
