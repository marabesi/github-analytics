<template>
  <div id="bubble"></div>
</template>
<script>
import * as d3 from 'd3'

export default {
  props: {
    data: {
      type: Object,
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
    margin () {
      return { top: 10, right: 30, bottom: 90, left: 40 }
    },
    innerWidth () {
      return this.width - 50 - this.margin.left - this.margin.right
    },
    innerHeight () {
      return this.height - this.margin.top - this.margin.bottom
    },
    color () {
      return d3.scaleOrdinal(d3.schemeCategory10)
    },
    bubble () {
      return d3.pack(this.data)
        .size([this.innerWidth, this.innerHeight])
        .padding(1.5)
    }
  },
  watch: {
    data () {
      this.draw()
    }
  },
  mounted () {
    this.draw()
  },
  methods: {
    draw () {
      d3.select('#bubble').select('*').remove()

      const svg = d3.select('#bubble')
        .append('svg')
        .attr('width', this.innerWidth)
        .attr('height', this.innerHeight)
        .attr('class', 'bubble')

      const nodes = d3.hierarchy(this.data)
        .sum(d => { return d.count })

      const node = svg.selectAll('.node')
        .data(this.bubble(nodes).descendants())
        .enter()
        .filter(d => {
          return !d.children
        })
        .append('g')
        .attr('class', 'node')
        .attr('transform', d => {
          return 'translate(' + d.x + ',' + d.y + ')'
        })

      node.append('title')
        .text(d => {
          return d.data.name + ': ' + d.data.count
        })

      node.append('circle')
        .attr('r', d => {
          if (d.r < 20) {
            return d.r * 3
          }
          return d.r
        })
        .style('fill', (d, i) => {
          return this.color(i)
        })

      node.append('text')
        .attr('dy', '.2em')
        .style('text-anchor', 'middle')
        .text(d => {
          return d.data && d.data.name ? d.data.name.substring(0, d.r / 3) : ''
        })
        .attr('font-family', 'sans-serif')
        .attr('font-size', d => {
          if (d.r < 20) {
            return d.r * 1.3
          }
          return d.r / 5
        })
        .attr('fill', 'white')

      node.append('text')
        .attr('dy', '1.3em')
        .style('text-anchor', 'middle')
        .text(d => {
          return d.data.count
        })
        .attr('font-family', 'Gill Sans', 'Gill Sans MT')
        .attr('font-size', d => {
          if (d.r < 20) {
            return d.r * 1.3
          }
          return d.r / 5
        })
        .attr('fill', 'white')

      d3.select(self.frameElement)
        .style('height', this.innerWidth + 'px')
    }
  }
}
</script>
