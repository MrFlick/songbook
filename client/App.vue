<template>
  <div>
    <div class="ui inverted menu">
      <div class="ui container">
        <router-link to="/" class="header item">Songbook</router-link>
        <router-link to="/tags" class="item">Tag</router-link>
        <router-link to="/albums" class="item">Albums</router-link>
      </div>
    </div>
    <div class="ui main text container">
    <router-view></router-view>
    </div>
  </div>
</template>

<script>


export default { };
</script>