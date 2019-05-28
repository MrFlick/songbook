/// <token-list :items="[{id: 1, name: 'One'}, {id:2, name: 'Two'}]"/>
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
    <div class="ui label" v-for="(item, index) in itemState" v-bind:key="item.key">
      {{ item.value.name }}
      <i v-show="isEditing" @click="deleteItem(index)" class="delete icon"></i>
    </div>
    <div v-if="isEditing" class="holder">
      <input ref="input" v-model="newItem" 
        @input="userInput" 
        @keydown.up.prevent="selectUp"
        @keydown.down.prevent="selectDown"
        @keydown.tab.prevent="selectAccept"
        @keydown.delete="selectDelete($event)"
        @keydown.enter.prevent="chooseItem"
        @focus="findSuggestions"
        @blur="hideSuggestions"
        />
      <span ref="textsize" class="hide"></span>
      <div v-show="itemOptions.length > 0" class="dropdown">
        <a v-for="(s, index) in itemOptions" href="#"
        :key="s.id"
        :class="{active: index==selectedIndex}"
        @click="selectIndex(index)">{{ s.name }}</a>
      </div> 
    </div>
    <div v-else class="holder">
      <button @click="makeEditable" class="ui mini labeled icon button">
        Edit <i class="edit icon"></i></button>
    </div>
  </div>
</template>

<script>
export default { 
  name: "token-list",
  props: ['items'],
  data ()  {
    return { 
      itemState: [],
      itemOptions: [],
      newItem: "",
      isEditing: false,
      newId: 0,
      selectedIndex: -1,
      suggestions: [],
    }
  },
  created () {
    this.fetchData();
  },
  watch: {
    items: function (val) {
      this.itemState = val.map((v) => ({key: this.newId++, value: v, state: 'orig'}));
    },
    itemState: function(val) {
      console.log(val);
    }
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
        this.itemOptions = this.suggestions.filter(x => x.name.match(regex));  
      } else {
        this.itemOptions = [];
      }
      this.selectedIndex = -1;
    },
    chooseItem() {
      if (this.selectedIndex >- 1) {
        this.addItem(this.itemOptions[this.selectedIndex], "auto");
        this.clearSuggestions();
        this.resetInput();
      } else if (this.newItem) {
        this.addItem({name: this.newItem}, "new");
        this.clearSuggestions();
        this.resetInput();
      } else {
        this.editDone()
      }
    },
    addItem(item, state) {
      this.itemState.push({key: this.newId++, value: item, state});
      this.newItem = "";
    },
    selectUp() {
      if (this.selectedIndex > 0) {
        this.selectedIndex--;
      }
    },
    selectDown() {
      if (this.selectedIndex < this.itemOptions.length -1 ) {
        this.selectedIndex++;
      }
    },
    selectIndex(index) {
      this.selectedIndex = index;
      this.selectAccept();
    },
    deleteItem(index) {
      this.itemState.splice(index, 1);
      this.resetInput();
    },
    selectAccept() {
      if(this.selectedIndex>-1) {
        this.chooseItem();
      } else if (this.itemOptions.length) {
        this.selectedIndex = 0;
        this.chooseItem();
      }
    },
    selectDelete(e) {
      if (this.newItem) return; //let default happen
      e.preventDefault();
      if(this.itemState.length) {
        this.itemState.pop();
      }
    },
    clearSuggestions() {
      this.selectedIndex = -1;
      this.itemOptions = [];
    },
    hideSuggestions() {
      setTimeout(() => {
        this.clearSuggestions();
      }, 200);
    },
    resetInput() {
      this.resizeInput();
      this.$nextTick(() => this.$refs.input.focus());
    },
    editDone() {
      this.isEditing = false;
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