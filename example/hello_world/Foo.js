import {
  getCurrentInstance,
  h,
  renderSlots,
} from "../../lib/guide-mini-vue-esm.js";

export const Foo = {
  name: "Foo",
  setup() {
    const instance = getCurrentInstance();
    console.log("🤔 ~ file: Foo.js ~ line 6 ~ setup ~ instance", instance);
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
