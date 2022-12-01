import { h, inject, provide } from "../../lib/guide-mini-vue-esm.js";

const Provider = {
  name: "Provider",
  setup() {
    provide("foo", "fooVal");
    provide("bar", "barVal");
  },
  render() {
    return h("div", {}, [h("p", {}, "Provider"), h(Middle)]);
  },
};

const Middle = {
  name: "Middle",
  setup() {
    provide("foo", "foo.middle");
    const foo = inject("foo");
    return { foo };
  },
  render() {
    return h("div", {}, [h("p", {}, `middle:${this.foo}`), h(Consumer)]);
  },
};

const Consumer = {
  name: "Consumer",
  setup() {
    const foo = inject("foo");
    const bar = inject("bar");
    const baz = inject("baz", () => "baz");

    return {
      foo,
      bar,
      baz,
    };
  },
  render() {
    return h("div", {}, `Consumer: - ${this.foo} . ${this.bar} . ${this.baz}`);
  },
};

export default {
  name: "App",
  setup() {},
  render() {
    return h(Provider);
  },
};
