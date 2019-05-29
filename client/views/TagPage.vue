<template>
  <div>
    <router-link to="/tags">Back to All Tags</router-link>
    <h2>{{ tag.name }}</h2>
    <div class="ui relaxed divided list">
      <div class="item" v-for="a in tag.albums" :key="a.id">
        <img class="medium middle aligned image" src="/s/images/baseline-album-24px.svg"/>
        <div class="content">
          <router-link :to="`/album/${a.id}`" class="header">{{a.name}}</router-link>
        </div>
      </div>
    </div>
    <div class="ui relaxed divided list">
      <div class="item" v-for="t in tag.tracks" :key="t.id">
        <img class="medium middle aligned image" src="/s/images/baseline-music_note-24px.svg"/>
        <div class="content">
          <router-link :to="`/track/${t.id}`" class="header">{{t.name}}</router-link>
          <div class="description">{{t.album.name}}</div>
        </div>
      </div>
    </div>
    <router-link to="/tags">Back to All Tags</router-link>
  </div>
</template>

<script>
export default { 
  data ()  {
    return { 
      tag: {},
    }
  },
  created() {
    this.tagId = this.$route.params.id;
    this.fetchData();
  },
  watch: {
    '$route': "fetchData",
  },
  methods: {
    fetchData() {
      fetch(`/api/tag/${this.tagId}`).then((resp) => {
        return resp.json();
      }).then((resp) => {
        this.tag = resp;
      });
    },
  },
};
</script>
