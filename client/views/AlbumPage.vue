<template>
  <div>
    <h2>{{ this.album.name }}</h2>
    <router-link to="/albums">Back to All Albums</router-link>
    <div class="ui unstackable divided items">
      <div class="item" v-for="t in album.tracks" v-bind:key="t.Id">
        <img class="ui icon" width="50px" src="/s/images/baseline-music_note-24px.svg">
        <div class="content">
          <span class="header">{{t.name}}</span>
          <div class="description"><div class="ui image label" v-for="p in t.people" v-bind:key="p.Id">
              {{ p.name }}
          </div></div>
          <div class="description">{{formatTime(t.length)}}</div>
        </div>
      </div>
    </div>
    <router-link to="/albums">Back to All Albums</router-link>
  </div>
</template>

<script>

export default { 
  data ()  {
    return { 
      album: {},
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
      fetch(`/api/album/${this.$route.params.id}`).then((resp) => {
        return resp.json();
      }).then((resp) => {
        this.album = resp;
      });
    },
    formatTime(millisecs) {
      const date = new Date(millisecs);
      return date.toISOString().substr(14, 5);
    }
  },
};
</script>