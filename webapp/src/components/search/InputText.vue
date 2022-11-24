<template>
  <form class="repo" @submit.prevent="loadData">
    <input
      type="text"
      placeholder="Github Repo - :owner/:repo eg: marabesi/testable"
      class="repo__input"
      v-model="repo"
    />
    <button @click="loadData" class="repo__load">Load</button>
  </form>
</template>
<script>
export default {
  name: 'InputText',
  data: () => ({
    repo: '',
    searched: ''
  }),
  methods: {
    loadData() {
      if (!this.repo || !this.repo.includes('/')) {
        return
      }

      if (this.repo === this.searched) {
        return
      }

      this.searched = this.repo

      this.$emit('onSearch', this.repo)
    }
  }
};
</script>

<style>
.repo {
  display: flex;
  width: 100%;
}
.repo .repo__load, .repo .repo__input {
  padding: 10px;
}
.repo .repo__input {
  width: 100%;
}
.repo .repo__load {
  margin-left: 10px;
}
</style>
