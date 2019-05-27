<template>
  <div class="ui unstackable divided items">
    <div class="item" v-for="t in album.tracks" v-bind:key="t.Id">
      <img class="ui icon fst" width="50px" src="/s/images/baseline-music_note-24px.svg">
      <div class="content">
        <span class="header">{{t.name}}</span>
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
export default { 
  name: 'album-track-list',
  props: ['album'],
  methods: {
    formatTime(millisecs) {
      const date = new Date(millisecs);
      return date.toISOString().substr(14, 5);
    }
  },
};
</script>

<style>
.fst {
  align-self: self-start;
}
</style>