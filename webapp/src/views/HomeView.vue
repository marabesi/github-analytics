<template>
  <app />
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import App from '@/App.vue'

@Options({
  components: {
    App
  }
})
export default class HomeView extends Vue {}
</script>
