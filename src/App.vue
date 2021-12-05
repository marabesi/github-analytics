<template>
  <div id="app">
    <div v-show="!loading" :class="[{'empty': options.data.length === 0}, 'repo']">
      <InputText @onSearch="loadData" />
    </div>

    <h1 v-if="options.data.length">{{ repo }}</h1>

    <div v-if="options.data.length">
      <div class="row">
        <AuthorList
            :authors="authors"
            :filters="filters"
        />

        <div class="options">
          <h2>Repo activity by</h2>
          <label v-for="option in by" :key="option.value" class="option">
            {{ option.label }}
            <input
                :data-testid="option.label"
                type="radio"
                name="by"
                :checked="option.value === options.by"
                :value="option.value"
                @change="rangeUpdated"
            />
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
import InputText from '@/components/search/InputText.vue'
import BarChart from '@/components/charts/BarChart.vue'
import BubbleChart from '@/components/charts/BubbleChart.vue'
import WordCloud from '@/components/charts/WordCloud.vue'
import { parse_link_header } from '@/githubHeader'
import { BY_DAY, BY_WEEK, BY_MONTH, BY_YEAR } from './constants'
import AuthorList from "@/components/authors/AuthorList"

const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET

export default {
  name: 'app',
  components: {
    AuthorList,
    InputText,
    BarChart,
    BubbleChart,
    WordCloud
  },
  data: () => ({
    loading: false,
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
    loadData(repo) {
      this.repo = repo
      if (this.loading) {
        return
      }

      this.loading = true
      const url = `https://api.github.com/repos/${repo}/{report}?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`
      Promise.all([
        this.fetchStackStats(url.replace('{report}', 'languages')),
        this.fetchData(url.replace('{report}', 'commits')),
        this.fetchTopics(url.replace('{report}', 'topics'))
      ])
      .finally(() => this.loading = false)
    },
    rangeUpdated(event) {
      this.options.by = parseInt(event.target.value)
    },
    fetchStackStats(url) {
      return fetch(url).then(response => response.json())
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
      return fetch(url, { headers }).then(response => response.json())
          .then(data => {
            if (data.names) {
              this.topics = data.names.map(text => {
                return {
                  text
                }
              })
            }
          })
    },
    fetchData(url) {
      const requests = []
      return fetch(url)
          .then(response => {
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
            }).catch(error => console.error(error))
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
.empty {
  position: absolute;
  top: calc(50% - 50px);
  left: calc(50% - 200px);
  width: 400px;
}
</style>
