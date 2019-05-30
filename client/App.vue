<template>
  <div>
    <div class="ui inverted menu">
      <div class="ui container">
        <router-link to="/" class="header item">Songbook</router-link>
        <router-link to="/albums" class="item">Albums</router-link>
        <router-link to="/tags" class="item">Tags</router-link>
        <omni-search class="right floated item" />
      </div>
    </div>
    <div class="ui main text container">
    <router-view></router-view>
    </div>
  </div>
</template>

<script>
import OmniSearch from './components/OmniSearch.vue';
export default { 
  components: {OmniSearch}
};
</script>