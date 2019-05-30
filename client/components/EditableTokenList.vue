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
    Tags: <a class="ui label" 
      v-for="(item, index) in itemState" 
      v-bind:key="item.key" 
      @click.prevent="tokenClick(item)"
      href="#">
      {{ item.value.name }}
      <i v-show="isEditing" @click="deleteItem(index)" class="delete icon"></i>
    </a>
    <div v-if="isEditing" class="holder">
      <input ref="input" v-model="newItem" 
        @input="userInput" 
        @keydown.up.prevent="selectUp"
        @keydown.down.prevent="selectDown"
        @keydown.tab.prevent="selectAccept"
        @keydown.delete="selectDelete($event)"
        @keydown.enter.prevent="chooseItem"
        @focus="requestSuggestions"
        @blur="hideSuggestions"
        placeholder="(type or press enter when done)"
        />
      <span ref="textsize" class="hide"></span>
      <div v-show="suggestions.length > 0" class="dropdown">
        <a v-for="(s, index) in suggestions" href="#"
        :key="s.id"
        :class="{active: index==suggestIndex}"
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
const itemStates = {
  ORIG: 'orig',
  AUTO: 'auto',
  NEW: 'new',
};

export default { 
  name: "token-list",
  props: ['items'],
  data ()  {
    return { 
      itemState: [],
      suggestions: [],
      suggestIndex: -1,
      newItem: "",
      isEditing: false,
      newId: 0,
    }
  },
  watch: {
    items: {
      immediate: true,
      handler: function (val) {
        if(val) {
          this.itemState = val.map((v) => ({
            key: this.newId++, 
            value: v, 
            state: itemStates.ORIG}));
        } else {
          this.itemStates = [];
        }
    }},
    suggestions: function(val) {
      this.suggestIndex = -1;
    },
  },
  methods: {
    userInput() {
      this.resizeInput();
      this.requestSuggestions();
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
      let text = (this.newItem) ? this.newItem : this.$refs.input.placeholder;
      this.$refs.textsize.textContent = text;
      let offsetWidth = this.$refs.textsize.offsetWidth + 10;
      if (offsetWidth < 50) {
        offsetWidth = 50;
      }
      this.$refs.input.style.width =  offsetWidth + "px";
    },
    requestSuggestions() {
      this.$emit('suggest', this.newItem, this);
    },
    chooseItem() {
      if (this.suggestIndex >- 1) {
        this.addItem(this.suggestions[this.suggestIndex], itemStates.AUTO);
        this.clearSuggestions();
        this.resetInput();
      } else if (this.newItem) {
        let found=false;
        let i = 0;
        for(; i<this.suggestions.length; i++) {
          if (this.suggestions[i].name===this.newItem) {
            found = true;
            break;
          }
        };
        if (found) {
          this.addItem(this.suggestions[i], itemStates.AUTO);
        } else {
          this.addItem({name: this.newItem}, itemStates.NEW);
        }
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
      if (this.suggestIndex > 0) {
        this.suggestIndex--;
      }
    },
    selectDown() {
      if (this.suggestIndex < this.suggestions.length -1 ) {
        this.suggestIndex++;
      }
    },
    selectIndex(index) {
      this.suggestIndex = index;
      this.selectAccept();
    },
    deleteItem(index) {
      this.itemState.splice(index, 1);
      this.resetInput();
    },
    selectAccept() {
      if(this.suggestIndex>-1) {
        this.chooseItem();
      } else if (this.suggestions.length) {
        this.suggestIndex = 0;
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
      this.suggestIndex = -1;
      this.suggestions = [];
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
      this.$emit("input", this.getDelta());
    },
    getDelta() {
      const keepList = [];
      const addList = [];
      const delList = [];
      const newList = [];
      const origKeys = new Map(
        this.items.map((x,i) => [x.id, {index: i, found:false}])
      );
      this.itemState.forEach((item) => {
        if (item.state !== itemStates.NEW) {
          let itemId = item.value.id
          if (origKeys.has(itemId)) {
            keepList.push(item.value);
            let ii = origKeys.get(itemId)
            ii.found = true;
            origKeys.get(itemId, ii);
          } else {
            addList.push(item.value);
          }
        } else if (item.state === itemStates.NEW) {
          newList.push(item.value);
        }
      });
      for (let [id, details] of origKeys) {
        if( ! details.found ) {
          delList.push(this.items[details.index]);
        }
      };
      const result = {
        keep: keepList,
        add: addList,
        new: newList,
        delete: delList,
      }
      return result;
    },
    tokenClick(token) {
      if (!this.isEditing) {
        this.$emit('tokenClick', token.value);
      }
    }
  },
};
</script>