<template>
  <div class="ui relaxed divided list">
    <div v-for="t in tags" v-bind:key="t.id" class="item">
      <i class="large tag middle aligned icon"></i>
      <div class="content">
        <router-link :to="'/tag/' + t.id" class="header">{{ t.name }}</router-link>
        <div class="description">Albums: {{t.albumCount}}, Tracks: {{t.trackCount}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../utils/apiwrapper.js';

export default { 
  data ()  {
    return { 
      tags: [],
    }
  },
  created() {
    this.fetchData();
  },
  watch: {
    '$route': "fetchData",
  },
  methods: {
    fetchData() {
      api.getTags()
      .then((resp) => {
        this.tags = resp;
      });
    },
  },
};
</script>