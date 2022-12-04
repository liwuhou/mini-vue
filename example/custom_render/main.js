import { createRenderer } from "../../lib/guide-mini-vue-esm.js";
import { App } from "./app.js";

const game = new PIXI.Application({
  width: 500,
  height: 500,
});
document.body.append(game.view);

const createApp = createRenderer({
  createElement(type) {
    if (type === "rect") {
      const rect = new PIXI.Graphics();
      rect.beginFill(0xff0000);
      rect.drawRect(0, 0, 100, 100);
      rect.endFill();

      return rect;
    }
  },
  patchProps(el, key, val) {
    el[key] = val;
  },
  insert(child, parent) {
    parent.addChild(child);
  },
  findElement(pxView) {
    return pxView.stage;
  },
});

createApp(App).mounted(game);
