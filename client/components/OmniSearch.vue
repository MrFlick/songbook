<template>
  <div class="ui search">
    <input class="prompt" type="text" 
      placeholder="Search..."
      v-model="searchTerm"
      @input="debounceFetch"
      @keydown.up="selectUp"
      @keydown.down="selectDown"
      @keydown.enter="selectEnter">
    <div v-show="results.length>0" class="results visible" style="display: block;">
      <a v-for="(t, index) in results" :key="t.id" 
      :class="{active: index==selectedIndex, result: true}" 
      :href="t.link">
        <img :src="t.icon" v-if="t.icon" class="ui avatar image"/>
        {{t.name}}
        <div class="description" v-if="t.album && t.album.name">
          {{t.album.name}}</div>
        </a>
    </div>
  </div>
</template>

<script>
import debounce from '../utils/debounce.js';

export default {
  name: 'omni-search',
  data: function() {
    return {
      searchTerm: "",
      selectedIndex: -1,
      results: [],
    };
  },
  methods: {
    debounceFetch: debounce(function () { this.fetchSearch() }, 350),
    fetchSearch() {
      if (this.searchTerm) {
        fetch(`/api/search/${this.searchTerm}`).then((resp) => {
          return resp.json();
        }).then((resp) => {
          this.parseRawResults(resp);
        });
      } else {
        this.results = [];
      }
    },
    parseRawResults(resp) {
      let idx = 0;
      function cleanType(type) {
        let icon="";
        if (type === "album") {
          icon = "/s/images/baseline-album-24px.svg"
        } else if (type === "track") {
          icon = "/s/images/baseline-music_note-24px.svg"
        } else if (type === "tag") {
          icon = "/s/images/baseline-label-24px.svg"
        } else if (type === "person") {
          icon = "/s/images/baseline-person-24px.svg"
        }
        return function cleanItem(item) {
          item.orig_id = item.id
          item.id = idx++;
          item.type = type;
          item.icon = icon;
          return item;
        }
      }
      const results = []
        .concat(resp.albums.map(cleanType('album')))
        .concat(resp.tracks.map(cleanType('track')))
        .concat(resp.people.map(cleanType('person')))
        .concat(resp.tags.map(cleanType('tag')));
      this.selectedIndex = -1;
      results.sort((a, b) => {
        a = (a.sortName || a.name);
        b = (b.sortName || b.name);
        return a.localeCompare(b, undefined, {sensitivity: 'base'});
      });
      this.results = results;
    },
    selectUp() {
      if (this.selectedIndex > 0) {
        this.selectedIndex--;
      }
    },
    selectDown() {
      if (this.selectedIndex < this.results.length -1 ) {
        this.selectedIndex++;
      }
    },
    selectEnter() {
      const item = this.results[this.selectedIndex];
      if (item && item.link) {
        this.clearSearch();
        this.$router.push(item.link);
      }
    },
    clearSearch() {
      this.searchTerm = [];
      this.results = [];
    }
  }
};
</script>