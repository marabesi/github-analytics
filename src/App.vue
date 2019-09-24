<template>
  <div id="app">
    <div :class="[{'empty': options.data.length === 0}, 'repo']">
      <input
        type="text"
        placeholder="Github Repo - :owner/:repo eg: marabesi/testable"
        class="repo__input"
        v-model="repo"
      />
      <button
        v-show="repo.length"
        @click="loadData"
        class="repo__load"
      >
        Load
      </button>
    </div>

    <h2 v-show="options.data.length">{{ repo }}</h2>

    <div v-show="options.data.length">
      <div class="row">
        <div class="authors">
          <h2>Authors ({{ authors.length }})</h2>
          <ul class="authors__list">
            <li v-for="author in authors" :key="author.login">
                <label v-if="author.login">
                  <ImageWrapper :src="author.avatar_url" width="60" />
                  <p>
                      {{ author.login }}
                      <input type="checkbox" name="author" :checked="filters.includes(author.login)" :value="author.login" />
                  </p>
                </label>
            </li>
          </ul>
        </div>
        
        <div class="options">
          <h2>Repo activity by</h2>
          <label v-for="option in by" :key="option.value" class="option">
            {{ option.label }}
            <input type="radio" name="by" :checked="option.value === options.by" :value="option.value" @change="rangeUpdated" />
          </label>
        </div>
      </div>

      <div :style="`overflow-x: auto; padding: 10px`">
        <h2>Commits ({{ options.data.length }})</h2>
        <BarChart
          v-bind="options"
        />
      </div>

      <div class="stats">
        <div>
          <h2>Tech stack (in bytes - {{ stackTotal }})</h2>
          <BubbleChart
            :data="stackStats"
            :width="width / 2"
            :height="height"
          />
        </div>
        <div>
          <h2>Topics ({{ topics.length }})</h2>
          <WordCloud
            :words="topics"
            :width="width / 2"
            :height="height"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import ImageWrapper from '@/components/ImageWrapper.vue'
import BarChart from '@/components/BarChart.vue'
import BubbleChart from '@/components/BubbleChart.vue'
import WordCloud from '@/components/WordCloud.vue'
import { parse_link_header } from '@/githubHeader'
import { BY_DAY, BY_WEEK, BY_MONTH, BY_YEAR } from './constants'

const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET

export default {
  name: 'app',
  components: {
    ImageWrapper,
    BarChart,
    BubbleChart,
    WordCloud
  },
  data: () => ({
    repo: '',
    by: [
      { value: BY_DAY, label: 'day' },
      { value: BY_WEEK, label: 'week' },
      { value: BY_MONTH, label: 'month' },
      { value: BY_YEAR, label: 'year' }
    ],
    options: {
      data: [],
      by: BY_MONTH,
      width: 960,
      height: 450
    },
    authors: [],
    stackStats: {},
    stackTotal: 0,
    topics: [],
    width: 960 - 10,
    height: 450,
    filters: []
  }),
  methods: {
    loadData() {
      const url = `https://api.github.com/repos/${this.repo}/{report}?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`
      this.fetchData(url.replace('{report}', 'commits'))
      this.fetchStackStats(url.replace('{report}', 'languages'))
      this.fetchTopics(url.replace('{report}', 'topics'))
    },
    rangeUpdated(event) {
      this.options.by = parseInt(event.target.value)
    },
    fetchStackStats(url) {
      fetch(url).then(response => response.json())
        .then(data => {
          const langs = []
          let total = 0

          for (const lang in data) {
            langs.push({
              name: lang,
              count: data[lang]
            })
            total += data[lang]
          }
          this.stackStats = { children: langs }
          this.stackTotal = total
        })
    },
    fetchTopics(url) {
      const headers = new Headers()
      headers.append('Accept', 'application/vnd.github.mercy-preview+json')
      fetch(url, { headers }).then(response => response.json())
        .then(data => {
          this.topics = data.names.map(text => {
            return {
              text
            }
          })
        })
    },
    fetchData(url) {
        const requests = []
        fetch(url)
          .then( response => {
              const headers = response.headers.values()
              for(let test of headers) {
                if (test.includes('api.github')) {
                  const nextPage = parse_link_header(test)
                  
                  if (nextPage.last) {
                    const dale = nextPage.last.split('=')
                    const last = dale[dale.length - 1]

                    for (var i = 1; i < last; i++) {
                      requests.push(fetch(`${url}&page=${i + 1}`).then(data => data.json()))
                    }
                  }
                }
              }
              response.json().then(firstDataSet => {
                Promise.all(requests).then(data => {
                  data.push(firstDataSet)
                  const normalize = _.flatten(data)
                  this.options.data = normalize
                  this.authors = _.uniqBy(this.options.data.map(item => {
                    const author = {
                      login: item.author ? item.author.login : '',
                      avatar_url: item.author ? item.author.avatar_url: ''
                    }
                    this.filters.push(author.login)
                    return author
                  }), 'login')
                })
              })
          })
      },
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  width: 960px;
  margin: 0 auto;
  overflow: hidden;
}
.row {
  display: flex;
  align-items: baseline;
}
.options {
  padding: 5px;
  margin: 5px;
}
.options .option {
  margin-right: 20px;
}
.stats {
  display: flex;
  justify-content: space-between;
}
.authors {
  max-width: 50%;
  overflow: auto;
}
.authors .authors__list {
  list-style: none;
  padding-left: 0;
  display: flex;
}
.authors .authors__list li {
  margin-right: 10px;
}
.repo {
  display: flex;
}
.repo .repo__load, .repo .repo__input {
  padding: 10px;
}
.repo .repo__input {
  width: 100%;
}
.empty {
  position: absolute;
  top: calc(50% - 50px);
  left: calc(50% - 200px);
  width: 400px;
}
.repo .repo__load {
  margin-left: 10px;
}
</style>
