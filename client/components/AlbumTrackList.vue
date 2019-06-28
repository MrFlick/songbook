<template>
  <div class="ui unstackable divided items">
    <div class="item" v-for="t in album.tracks" v-bind:key="t.Id">
      <img class="ui icon fst" width="50px" src="/s/images/baseline-music_note-24px.svg">
      <div class="content">
        <span class="header"><router-link :to="`/track/${t.id}`" class="header">{{t.name}}</router-link></span>
        <div class="description">
          <token-list
            :items="t.tags"
            @suggest = "suggestTrackTag"
            @input = "inputTrackTags($event, t)"
            @tokenClick = "tagClick"/>
        </div>
        <div class="description">
          <router-link v-for="p in t.people" :to="`/person/${p.id}`"
            v-bind:key="p.Id" class="ui label">
            {{ p.name }}
          </router-link>
        </div>
        <div class="description">{{formatTime(t.length)}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import TokenList from '../components/EditableTokenList.vue';

export default { 
  name: 'album-track-list',
  props: ['album'],
  components: {
    TokenList,
  },
  methods: {
    formatTime(millisecs) {
      const date = new Date(millisecs);
      return date.toISOString().substr(14, 5);
    },
    suggestTrackTag(...args) {
      this.$emit('trackSuggest', ...args);
    },
    inputTrackTags(delta, track) {
      this.$emit('trackInput', delta, track);
    },
    tagClick(track) {
      this.$emit('tagClick', track);
    }
  },
};
</script>

<style>
.fst {
  align-self: self-start;
}
</style>