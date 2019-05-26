<template>
  <div>
    <ul>
      <li v-for="a in albums" v-bind:key="a.albumId">{{a.name}}</li>
    </ul>
  </div>
</template>

<script>
export default { 
  data ()  {
    return { 
      albums: [],
    }
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