<template>
  <div id="cloud"></div>
</template>
<script>
import * as d3 from 'd3'
import cloud from 'd3-cloud'

export default {
  props: {
    words: {
      type: Array,
      required: true
    },
    width: {
      type: Number,
      required: true
    },
    height: {
      type: Number,
      required: true
    }
  },
  computed: {
    fill: () => d3.schemeCategory10,
    margin() {
      return {top: 10, right: 30, bottom: 90, left: 40}
    },
    innerWidth() {
      return this.width - 50 - this.margin.left - this.margin.right
    },
    innerHeight() {
      return this.height - this.margin.top - this.margin.bottom
    },
  },
  watch: {
    words() {
      this.setUp()
    }
  },
  methods: {
    setUp() {
      this.layout = cloud()
          .size([this.innerWidth, this.innerHeight])
          .words(this.words.map(d => {
            return {text: d.text, size: 10 + Math.random() * 90};
          }))
          .padding(5)
          .rotate(() => { return ~~(Math.random() * 2) * 90; })
          .font("Impact")
          .fontSize(d => { return d.size; })
          .on("end", this.draw);

      this.layout.start();

    },
    draw(words) {
      d3.select("#cloud").select('*').remove()
      d3.select("#cloud")
        .append("svg")
          .attr("width", this.layout.size()[0])
          .attr("height", this.layout.size()[1])
        .append("g")
          .attr("transform", "translate(" + this.layout.size()[0] / 2 + "," + this.layout.size()[1] / 2 + ")")
        .selectAll("text")
          .data(words)
        .enter()
          .append("text")
          .style("font-size", d => { return d.size + "px"; })
          .style("font-family", "Impact")
          .attr("text-anchor", "middle")
          .attr('fill', (d, i) => this.fill[i])
          .attr("transform", d => {
            return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
          })
          .text(d => { return d.text; });
    }
  }
}
</script>