let app = new Vue({ 
  el: '#app',
  data: {
    albums: [],
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
});
