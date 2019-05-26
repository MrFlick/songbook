<template>
  <div>
    <ul>
      <li v-for="a in albums" v-bind:key="a.albumId">
        <router-link :to="'/album/' + a.id">{{a.name}}</router-link></li>
    </ul>
  </div>
</template>

<script>
export default { 
  name: 'album-list',
  props: ['albums'],
};
</script>