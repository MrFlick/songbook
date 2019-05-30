<template>
  <div>
    <router-link v-if="track.album && track.album.id" :to="`/album/${track.album.id}`">Back to Album</router-link>
    <h2>{{ track.name }}</h2>
    <p v-if="track.album && track.album.name">{{ track.album.name }}</p>
    <token-list
      :items="track.tags"
      @suggest="suggestTag"
      @input="updateTrackTags"
      />
    <div class="description">
      Artists: <router-link v-for="p in track.people" :to="`/person/${p.id}`"
        v-bind:key="p.Id" class="ui label">
        {{ p.name }}
      </router-link>

    </div>
    <router-link v-if="track.album && track.album.id" :to="`/album/${track.album.id}`">Back to Album</router-link>
  </div>
</template>

<script>
import TokenList from '../components/EditableTokenList.vue';

export default { 
  data ()  {
    return { 
      track: {},
      tags: [],
    }
  },
  components: {
    TokenList,
  },
  created() {
    this.trackId = this.$route.params.id;
    this.fetchData();
    this.fetchTagSuggestions();
  },
  watch: {
    '$route': "fetchData",
  },
  methods: {
    fetchData() {
      fetch(`/api/track/${this.trackId}`).then((resp) => {
        return resp.json();
      }).then((resp) => {
        this.track = resp;
      });
    },
    fetchTagSuggestions() {
      fetch('/api/tags').then((resp) => {
        return resp.json();
      }).then((resp) => {
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
      fetch(`/api/track/${this.trackId}/tags`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(delta)
      })
      .then(resp => resp.json())
      .then((resp) => {
        this.track.tags = resp;  
      });
    },
  },
};
</script>
