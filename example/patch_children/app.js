import { h } from "../../lib/guide-mini-vue-esm.js";

// import ArrayToText from './array2text'
// import TextToText from "./text2text.js";
// import TextToArray from "./text2array.js";
import ArrayToArray from "./array2array.js";

export default {
  name: "App",
  setup() {},
  render() {
    return h("div", { tId: 1 }, [
      h("p", {}, "主页"),
      // old children is array then newChildren is text node
      // h(ArrayToText),
      // oldChildren is Text then newChildren is Text type too
      // h(TextToText),
      // oldChildren is Text then newChildren is array of node
      // h(TextToArray),
      // both oldChildren and new Children are array type
      h(ArrayToArray),
    ]);
  },
};
