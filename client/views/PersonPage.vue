<template>
  <div class="ui unstackable divided items">
    <div v-for="album in tracks" :key="album.id" class="item">
      <img class="ui icon fst" width="50px" src="/s/images/baseline-album-24px.svg">
      <div class="content">
        <router-link :to="`/album/${album.id}`" class="header">{{ album.name }}</router-link>
        <div class="description">
          <album-track-list :album="album"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AlbumTrackList from '../components/AlbumTrackList.vue';

export default { 
  data ()  {
    return { 
      tracks: [],
    }
  },
  components: {
    AlbumTrackList,
  },
  created() {
    this.fetchData();
  },
  watch: {
    '$route': "fetchData",
  },
  methods: {
    fetchData() {
      fetch(`/api/person/${this.$route.params.id}/tracks`).then((resp) => {
        return resp.json();
      }).then((resp) => {
        this.tracks = resp;
      });
    },
  },
};
</script>

<style>
.fst {
  align-self: self-start;
}
</style>