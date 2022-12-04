import { h, ref } from "../../lib/guide-mini-vue-esm.js";

const prevChildren = "oldChildren";
const nextChildren = "newChildren";

export default {
  name: "ArrayToText",
  setup() {
    const isChange = ref(false);
    window.isChange = isChange;

    return {
      isChange,
    };
  },
  render() {
    console.log(
      "🤔 ~ file: array2text.js:22 ~ render ~ this.isChange",
      this.isChange
    );
    return this.isChange === true
      ? h("div", {}, nextChildren)
      : h("div", {}, prevChildren);
  },
};
