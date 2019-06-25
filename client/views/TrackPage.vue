<template>
  <div>
    <router-link v-if="track.album && track.album.id" :to="`/album/${track.album.id}`">Back to Album</router-link>
    <h2>{{ track.name }}</h2>
    <p v-if="track.album && track.album.name">{{ track.album.name }}</p>
    <token-list
      :items="track.tags"
      @suggest="suggestTag"
      @input="updateTrackTags"
      @tokenClick="gotoTag"
      />
    <div class="description">
      Artists: <router-link v-for="p in track.people" :to="`/person/${p.id}`"
        v-bind:key="p.Id" class="ui label">
        {{ p.name }}
      </router-link>
    </div>
    <div class="description">
      Lyrics: 
      <div v-show="!isEditingLyric" >
        <button class="ui button" @click.prevent="editLyric">Edit lyrics</button>
        <lyrics-display :lyric="lyric"></lyrics-display>
      </div>
      <div v-show="isEditingLyric" class="ui form">
        <textarea v-model="lyricValue"></textarea>
        <button class="ui submit button" @click.prevent="saveLyricEdit">Save</button>
        <button class="ui button" @click.prevent="cancelLyricEdit">Cancel</button>
      </div>
    </div>
    <router-link v-if="track.album && track.album.id" :to="`/album/${track.album.id}`">Back to Album</router-link>
  </div>
</template>

<script>
import TokenList from '../components/EditableTokenList.vue';
import LyricsDisplay from '../components/LyricsDisplay.vue';
import api from '../utils/apiwrapper.js';

export default { 
  data ()  {
    return { 
      track: {},
      tags: [],
      isEditingLyric: false,
      lyricValue: "",
    }
  },
  components: {
    TokenList,
    LyricsDisplay,
  },
  created() {
    this.trackId = this.$route.params.id;
    this.fetchData();
    this.fetchTagSuggestions();
  },
  watch: {
    '$route': function () {
      this.trackId = this.$route.params.id;
      this.fetchData();
    }
  },
  methods: {
    fetchData() {
      api.getTrack(this.trackId)
      .then((resp) => {
        this.track = resp;
      });
    },
    fetchTagSuggestions() {
      api.getTags().then((resp) => {
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
    updateTrackTags(delta) {
      api.updateTrackTags(this.trackId, delta)
      .then((resp) => {
        this.track.tags = resp;  
      });
    },
    gotoTag(tag) {
      this.$router.push(`/tag/${tag.id}`)
    },
    editLyric() {
      this.lyricValue = this.lyric;
      this.isEditingLyric = true;
    },
    cancelLyricEdit() {
      this.isEditingLyric = false;
      this.lyricValue = "";
    },
    saveLyricEdit() {
      this.isEditingLyric = false;
      api.saveLyrics(this.trackId, this.lyricValue)
      .then((lyric) => {this.track.lyric = lyric});
    },
  },
  computed: {
    lyric() {
      return this.track.lyric && this.track.lyric.text || "";
    }
  }
};
</script>
