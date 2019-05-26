<template>
  <div class="ui three cards">
    <router-link v-for="a in albums" v-bind:key="a.albumId" class="ui card" :to="'/album/' + a.id">
      <div class="content">
        <div class="header">{{a.name}}</div>
        <div class="meta">{{a.releaseYear}}</div>
      </div>
    </router-link>
  </div>
</template>

<script>
export default { 
  name: 'album-list',
  props: ['albums'],
};
</script>