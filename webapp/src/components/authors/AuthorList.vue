<template>
        <div class="authors">
          <h2>Authors ({{ authors.length }})</h2>
          <ul class="authors__list">
            <li v-for="author in authors" :key="author.login">
              <label v-if="author.login">
                <ImageWrapper :src="author.avatar_url" :width="60" />
                <p>
                  {{ author.login }}
                  <input
                      type="checkbox"
                      :data-testid="author.login"
                      name="author"
                      :checked="filters.includes(author.login)"
                      :value="author.login"
                  />
                </p>
              </label>
            </li>
          </ul>
        </div>
</template>

<script>
import ImageWrapper from '@/components/image/ImageWrapper'

export default {
  name: 'AuthorList',
  components: {
    ImageWrapper
  },
  props: {
    authors: {
      type: Array,
      required: true
    },
    filters: {
      type: Array,
      required: true
    }
  }
}
</script>

<style>
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
</style>
