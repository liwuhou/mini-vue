import {
  createTextVNode,
  getCurrentInstance,
  h,
} from "../../lib/guide-mini-vue-esm.js";
import { Foo } from "./Foo.js";

export const App = {
  name: "App",
  render() {
    const app = h("div", {}, "app");
    const foo = h(
      Foo,
      {},
      {
        header: ({ age }) => [
          h("p", {}, `foo ${age}`),
          createTextVNode("test"),
        ],
        footer: h("p", {}, "foo p2"),
      }
    );
    // const foo = h(Foo, {}, h('p', {}, 'foop'))

    return h("div", {}, [app, foo]);
  },
  setup() {
    const instance = getCurrentInstance();
    console.log("🤔 ~ file: app.js ~ line 25 ~ setup ~ instance", instance);
    return {};
  },
};
