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
