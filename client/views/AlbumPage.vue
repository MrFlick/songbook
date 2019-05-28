<template>
  <div>
    <router-link to="/albums">Back to All Albums</router-link>
    <h2>{{ album.name }}</h2>
    <token-list :items="album.tags" @input="updateAlbumTags"/>
    <album-track-list :album="album"/>
    <router-link to="/albums">Back to All Albums</router-link>
  </div>
</template>

<script>
import AlbumTrackList from '../components/AlbumTrackList.vue';
import TokenList from '../components/EditableTokenList.vue';

export default { 
  data ()  {
    return { 
      album: {},
    }
  },
  components: {
    AlbumTrackList,
    TokenList,
  },
  created() {
    this.albumId = this.$route.params.id;
    this.fetchData();
  },
  watch: {
    '$route': "fetchData",
  },
  methods: {
    fetchData() {
      fetch(`/api/album/${this.albumId}`).then((resp) => {
        return resp.json();
      }).then((resp) => {
        this.album = resp;
      });
    },
    updateAlbumTags(delta) {
      fetch(`/api/album/${this.albumId}/tags`, {
        method: 'POST',
        body: JSON.stringify(delta)
      })
      .then(resp => resp.json())
      .then((resp) => {
        this.album.tags = resp;  
      });
    },
  },
};
</script>
