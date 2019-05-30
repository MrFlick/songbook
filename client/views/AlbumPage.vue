<template>
  <div>
    <router-link to="/albums">Back to All Albums</router-link>
    <h2>{{ album.name }}</h2>
    <token-list
      :items="album.tags"
      @suggest="suggestTag"
      @input="updateAlbumTags"
      @tokenClick="tagClick"
      />
    <album-track-list 
      :album="album" 
      @trackSuggest="suggestTag"
      @trackInput="updateTrackTags"
      @tagClick="tagClick"/>
    <router-link to="/albums">Back to All Albums</router-link>
  </div>
</template>

<script>
import AlbumTrackList from '../components/AlbumTrackList.vue';
import TokenList from '../components/EditableTokenList.vue';
import api from '../utils/apiwrapper.js';

export default { 
  data ()  {
    return { 
      album: {},
      tags: [],
    }
  },
  components: {
    AlbumTrackList,
    TokenList,
  },
  created() {
    this.albumId = this.$route.params.id;
    this.fetchData();
    this.fetchTagSuggestions();
  },
  watch: {
    '$route': function() {
      this.albumId = this.$route.params.id;
      this.fetchData();
    }
  },
  methods: {
    fetchData() {
      api.getAlbum(this.albumId)
      .then((resp) => {
        this.album = resp;
      });
    },
    fetchTagSuggestions() {
      api.getTags()
      .then((resp) => {
        this.tags = resp;
      });
    },
    suggestTag(value, ref) {
      if (value) {
        const regex = new RegExp(value, 'i');
        ref.suggestions = this.tags.filter(x => x.name.match(regex));
      } else {
        ref.suggestions = [];
      }
      this.completeIndex = -1;
    },
    updateAlbumTags(delta) {
      api.updateAlbumTags(this.albumId, delta)
      .then((resp) => {
        this.album.tags = resp;  
      });
    },
    updateTrackTags(delta, track) {
      api.updateTrackTags(track.id, delta)
      .then((resp) => {
        track.tags = resp;  
      });
    },
    tagClick(tag) {
      this.$router.push(`/tag/${tag.id}`);
    }
  },
};
</script>
