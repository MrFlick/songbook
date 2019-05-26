<template>
  <div>
    <ul>
      <li v-for="a in albums" v-bind:key="a.albumId">{{a.name}}</li>
    </ul>
  </div>
</template>

<script>
export default { 
  name: 'album-list',
  props: ['albums'],
};
</script>