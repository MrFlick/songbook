<script>
import { parse } from 'path';

class Partitioner {
  constructor() {
    this.blocks = [];
    this.items = [];
  }

  addItem(item) {
    this.items.push(item);
  }
  addParition() {
    if (this.items.length > 0) {
      this.blocks.push([...this.items]);
      this.items = [];
    }
   }
   getPartitions() {
     this.addParition();
     return this.blocks;
   }
}

//from https://stackoverflow.com/a/37129036/2372064
function *intersperse(a, delim) {
  let first = true;
  for (const x of a) {
    if (!first) {
      if (typeof delim === 'function') {
        yield delim();
      } else {
        yield delim;
      }
    }
    first = false;
    yield x;
  }
}

function linesToSplitParagrah(lines, h) {
  return h("p", [...intersperse(lines, ()=> h("br"))])
}

export default { 
  name: 'lyrics-display',
  props: ['lyric'],
  render: function(h) {
    if (!this.lyric) {
      return h("span", "No lyrics available")
    }
    let partitions = new Partitioner();
    let lines = this.lyric.split(/\r?\n/g);
    lines.forEach((line) => {
      if (line=="") {
        partitions.addParition();
      } else {
        partitions.addItem(line);
      }
    })
    return h("div", partitions.getPartitions().map(
      x => linesToSplitParagrah(x,h)));
  }
};
</script>