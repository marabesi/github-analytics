<template>
  <div id="chart"></div>
</template>

<script>
import _ from 'lodash'
import moment from 'moment'
import * as d3 from 'd3'
import { BY_DAY, BY_MONTH, BY_WEEK } from '../constants'

export default {
  name: 'BarChart',
  props: {
    by: {
      type: Number,
      required: true
    },
    data: {
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
    margin() {
      return {top: 10, right: 30, bottom: 90, left: 40}
    },
    innerWidth() {
      let defaultWidth = this.width;

      if (this.nomalizeData.length > 200) {
        defaultWidth *= 3
      }

      return defaultWidth - 50 - this.margin.left - this.margin.right
    },
    innerHeight() {
      return this.height - this.margin.top - this.margin.bottom
    },
    nomalizeData() {
      return _.sortBy(this.data, item => Date.parse(item.commit.committer.date))
    },
    barColor: () => d3.interpolateTurbo
  },
  watch: {
    by() {
      this.draw()
    },
    data() {
      this.draw()
    }
  },
  methods: {
    draw() {
      d3.select("#chart").select('*').remove()

      this.svg = d3.select("#chart")
          .append("svg")
          .attr("width", this.innerWidth + this.margin.left + this.margin.right)
          .attr("height", this.innerHeight + this.margin.top + this.margin.bottom)
          .append("g")
          .attr("transform",
                "translate(" + this.margin.left + "," + this.margin.top + ")")
      const domainTotaByDate = this.prepareData()

      const x = d3.scaleBand()
        .range([ 0, this.innerWidth ])
        .domain(d3.keys(domainTotaByDate))
        .padding(this.xPadding())

      const xTicks = d3.axisBottom(x)
        .tickPadding(10)

      const y = d3.scaleLinear()
        .domain([0, d3.max(d3.keys(_.countBy(domainTotaByDate, 'length')).map(item => parseInt(item)))])
        .range([ this.innerHeight, 0])
        .nice()

      this.svg.append("g")
        .attr("transform", "translate(0," + this.innerHeight + ")")
        .call(xTicks)
        .selectAll("text")
          .attr("transform", "translate(-10,0)rotate(-45)")
          .style("text-anchor", "end");

      this.svg.append("g")
        .call(d3.axisLeft(y))

      this.svg.selectAll("mybar")
        .data(this.nomalizeData)
        .enter()
        .append("rect")
        .attr("width", x.bandwidth())
        .attr("height", () => this.innerHeight - y(0))
        .attr("fill", d => {
          const date = this.parseDate(d.commit.committer.date) 
          return this.barColor(domainTotaByDate[date].length / 100)
        })
        .attr("x", d => {
          const date = this.parseDate(d.commit.committer.date)
          return x(date)
        })
        .attr("y", () => y(0))
        .append('title')
        .text(d => {
          const date = this.parseDate(d.commit.committer.date) 
          return `${domainTotaByDate[date].length} commit(s)`
        })

      this.svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - this.margin.left)
        .attr("x", 0 - (this.innerHeight / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Número de commits");

      this.svg.selectAll("rect")
        .transition()
        .duration(800)
        .attr("y", d => {
          const current = this.parseDate(d.commit.committer.date)
          return y(domainTotaByDate[current].length);
        })
        .attr("height", d => {
          const current = this.parseDate(d.commit.committer.date)
          return this.innerHeight - y(domainTotaByDate[current].length);
        })
        .delay((d, i) => i * 5)
      },
      xPadding() {
        if (this.nomalizeData.length > 200) {
          return 0.1
        }
        return 0.5
      },
      parseDate(date) {
        if (this.by === BY_DAY) {
          return moment(date).format('YYYY-MM-DD')
        }

        if (this.by === BY_WEEK) {
          return moment(date).format('YYYY-WW')
        }

        if (this.by === BY_MONTH) {
          return moment(date).format('YYYY-MM')
        }

        return moment(date).format('YYYY')
      },
      prepareData() {
        let format = 'YYYY'

        if (this.by === BY_DAY) {
          format = 'YYYY-MM-DD'
        }

        if (this.by === BY_WEEK) {
          format = 'YYYY-WW'
        }

        if (this.by === BY_MONTH) {
          format = 'YYYY-MM'
        }

        const grouped = _.groupBy(this.data, item => moment(item.commit.committer.date).format(format))

        const ordered = {}
        _(grouped).keys().sort().each(key => {
          ordered[key] = grouped[key]
        });

        return ordered
      }
    }
}
</script>
