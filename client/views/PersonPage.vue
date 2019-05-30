<template>
  <div>
    <h2>{{person.name}}</h2>
    <div class="ui unstackable divided items">
      <div v-for="album in person.albums" :key="album.id" class="item">
        <img class="ui icon fst" width="50px" src="/s/images/baseline-album-24px.svg">
        <div class="content">
          <router-link :to="`/album/${album.id}`" class="header">{{ album.name }}</router-link>
          <div class="description">
            <album-track-list :album="album" @tagClick="tagClick"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AlbumTrackList from '../components/AlbumTrackList.vue';
import api from '../utils/apiwrapper.js';

export default { 
  data ()  {
    return { 
      person: {},
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
      api.getPerson(this.$route.params.id).then((resp) => {
        this.person = resp;
      });
    },
    tagClick(tag) {
      this.$router.push(`/tag/${tag.id}`);
    }
  },
};
</script>

<style>
.fst {
  align-self: self-start;
}
</style>