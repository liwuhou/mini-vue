import { h, renderSlots } from "../../lib/guide-mini-vue-esm.js";

export const Foo = {
  setup() {
    return {};
  },
  render() {
    const foo = h("p", {}, "foo");
    const age = 18;
    console.log(
      "🤔 ~ file: Foo.js ~ line 11 ~ render ~ this.$slots",
      this.$slots
    );
    // return h('div', {}, [renderSlots(this.$slots, 'header', { age }), foo, renderSlots(this.$slots, 'footer')])
    return h("div", {}, [
      renderSlots(this.$slots, "header", { age }),
      foo,
      renderSlots(this.$slots, "footer", { age }),
    ]);
  },
};
