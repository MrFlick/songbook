<template>
  <div>
    <h2>{{ this.album.name }}</h2>
    <router-link to="/albums">Back to All Albums</router-link>
    <ul>
      <li v-for="t in album.tracks" v-bind:key="t.Id">{{t.name}}</li>
    </ul>
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
  methods: {
    fetchData() {
      fetch(`./api/album/${this.$route.params.id}`).then((resp) => {
        return resp.json();
      }).then((resp) => {
        this.album = resp;
      });
    },
  },
};
</script>