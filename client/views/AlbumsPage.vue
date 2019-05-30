<template>
  <div>
    <album-list :albums="albums"></album-list>
  </div>
</template>

<script>
import AlbumList from '../components/AlbumList.vue';
import api from '../utils/apiwrapper.js';

export default { 
  data ()  {
    return { 
      albums: [],
    }
  },
  components: {
    AlbumList,
  },
  created() {
    this.fetchData();
  },
  watch: {
    '$route': "fetchData",
  },
  methods: {
    fetchData() {
      api.getAlbums()
      .then((resp) => {
        this.albums = resp;
      });
    },
  },
};
</script>