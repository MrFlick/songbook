<template>
  <div>
    <h2>{{ this.album.name }}</h2>
    <router-link to="/albums">Back to All Albums</router-link>
    <album-track-list :album="album"/>
    <router-link to="/albums">Back to All Albums</router-link>
  </div>
</template>

<script>
import AlbumTrackList from '../components/AlbumTrackList.vue';

export default { 
  data ()  {
    return { 
      album: {},
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
      fetch(`/api/album/${this.$route.params.id}`).then((resp) => {
        return resp.json();
      }).then((resp) => {
        this.album = resp;
      });
    }
  },
};
</script>
