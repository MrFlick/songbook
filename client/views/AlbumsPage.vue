<template>
  <div>
    <album-list :albums="albums"></album-list>
  </div>
</template>

<script>
import AlbumList from '../components/AlbumList.vue';

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
  methods: {
    fetchData() {
      fetch('./api/albums').then((resp) => {
        return resp.json();
      }).then((resp) => {
        this.albums = resp;
      });
    },
  },
};
</script>