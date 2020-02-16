<template>
  <div>
    <span v-if="loading" class="loading">Loading...</span>
    <img v-if="!loading" :src="blob" :width="width" />
  </div>
</template>
<script>
export default {
  name: 'ImageWrapper',
  props: {
    src: {
      type: String,
      required: true
    },
    width: {
      type: Number,
      default: () => 60
    }
  },
  data: () => ({
    loading: true,
    blob: null
  }),
  mounted() {
    return fetch(this.src)
      .then(response => response.blob())
      .then(blob => {
        const objectURL = URL.createObjectURL(blob)
        this.blob = objectURL
      }).finally(() => this.loading = false)
  }
}
</script>