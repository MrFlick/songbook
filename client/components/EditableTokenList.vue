<style scoped>
input {
  margin: 10px 2px;
  border: 0px;
  width: auto;
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
    border: 1px solid #ccc;
    box-shadow: 2px 2px 3px 3px #ccc;
    z-index: 50;
    background: white;
    min-width: 200px;
}
.dropdown a {
  display: block;
  padding: 2px 5px;
  color: dodgerblue;
}
.dropdown a:hover {
  background-color:rgb(158, 206, 255);
}
.dropdown a.active {
  background-color:dodgerblue;
  color: #eee;
}
.hide {
  padding: 0;
  position: absolute;
  height: 0;
  overflow: hidden;
  white-space: pre;
}
</style>

<template>
  <div>
    <div class="ui label" v-for="item in items" v-bind:key="item.id">
      {{ item.name }}
    </div>
    <div v-if="isEditing" class="holder">
      <input ref="input" v-model="newItem" 
        @input="userInput" 
        @keydown.up.prevent="selectUp"
        @keydown.down.prevent="selectDown"
        @keydown.tab.prevent="selectAccept"
        @keydown.delete="selectDelete"
        @keydown.enter.prevent="chooseItem"
        @focus="findSuggestions"
        @blur="hideSuggestions"
        />
      <span ref="textsize" class="hide"></span>
      <div v-show="show.length > 0" class="dropdown">
        <a v-for="(s, index) in show" href="#"
        :key="s.id"
        :class="{active: index==selectedIndex}"
        @click="selectIndex(index)">{{ s.name }}</a>
      </div> 
    </div>
    <div v-else class="holder">
      <button @click="makeEditable">Edit</button>
    </div>
  </div>
</template>

<script>
export default { 
  name: "token-list",
  data ()  {
    return { 
      items: [{id: 1, name: "One"}, {id:2, name: "Two"}],
      newItem: "",
      suggestions: [],
      show: [],
      isEditing: false,
      newId: -1,
      selectedIndex: -1,
    }
  },
  created () {
    this.fetchData();
  },
  methods: {
    userInput() {
      this.resizeInput();
      this.findSuggestions();
    },
    makeEditable() {
      this.isEditing = true;
      this.newItem = "";
      this.$nextTick(() => {
        this.resizeInput(); 
        this.$refs.input.focus();
      })
    },
    resizeInput() {
      // see https://stackoverflow.com/questions/8100770/auto-scaling-inputtype-text-to-width-of-value
      this.$refs.textsize.textContent = this.newItem;
      let offsetWidth = this.$refs.textsize.offsetWidth + 10;
      if (offsetWidth < 50) {
        offsetWidth = 50;
      }
      this.$refs.input.style.width =  offsetWidth + "px";
    },
    findSuggestions() {
      if (this.newItem) {
        const regex = new RegExp(this.newItem, 'i');
        this.show = this.suggestions.filter(x => x.name.match(regex));  
      } else {
        this.show = [];
      }
      this.selectedIndex = -1;
    },
    chooseItem() {
      if (this.selectedIndex >- 1) {
        this.addItem(this.show[this.selectedIndex])
      } else if (this.newItem) {
        this.addItem({id: this.newId, name: this.newItem})
        this.newId -= 1;
      }
      this.selectedIndex = -1;
      this.show = [];
      this.resizeInput();
    },
    addItem(item) {
      this.items.push(item);
      this.newItem = "";
    },
    selectUp() {
      if (this.selectedIndex > 0) {
        this.selectedIndex--;
      }
    },
    selectDown() {
      if (this.selectedIndex < this.show.length -1 ) {
        this.selectedIndex++;
      }
    },
    selectIndex(index) {
      this.selectedIndex = index;
      this.selectAccept();
    },
    selectAccept() {
      if(this.selectedIndex>-1) {
        this.chooseItem();
      }
    },
    selectDelete(e) {
      if (this.newItem) return; //let default happen
      e.preventDefault();
      if(this.items.length) {
        this.items.pop();
      }
    },
    hideSuggestions() {
      setTimeout(() => {
        this.show = []
      }, 200);
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