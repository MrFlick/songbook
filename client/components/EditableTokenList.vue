<style scoped>
input {
  background-color: aquamarine;
  margin: 10px 2px;
  border: 0px;
  outline: none;
  box-shadow: none;
  }
.holder {
  position: relative;
  display: inline-block;
}
.dropdown {
    margin-top: -8px;
    position: absolute;
    border: 1px solid red;
    z-index: 50;
    background: white;
}
.dropdown a {
  display: block;
}
</style>

<template>
  <div>
    <div class="ui label" v-for="item in items" v-bind:key="item.id">
      {{ item.name }}
    </div>
    <div class="holder">
      <input v-model="newitem" @keyup="userInput" 
        @focus="findSuggestions"
        @blur="hideSuggestions"/>
      <div v-show="show.length > 0" class="dropdown">
        <a v-for="s in show" :key="s.id">{{ s.name }}</a>
      </div>
    </div>
  </div>
</template>

<script>
export default { 
  name: "token-list",
  data ()  {
    return { 
      items: [{id: 1, name: "One"}, {id:2, name: "Two"}],
      newitem: "",
      suggestions: [],
      show: [],
    }
  },
  created () {
    this.fetchData();
  },
  methods: {
    userInput() {
      this.findSuggestions()
    },
    findSuggestions() {
      if (this.newitem) {
        const regex = new RegExp(this.newitem, 'i');
        this.show = this.suggestions.filter(x => x.name.match(regex));  
      } else {
        this.show = [];
      }
    },
    hideSuggestions() {
      this.show = [];
    },
    fetchData() {
      fetch('/api/people').then((resp) => {
        return resp.json();
      }).then((resp) => {
        this.suggestions = resp;
      });
    },
  },
};
</script>