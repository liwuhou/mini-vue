import { createRender } from "../runtime-core/index"
import { isEventName } from "../shared/index";

function createElement(type: string) {
    return document.createElement(type);
}

function patchProp(el: any, key: string, value: any) {
    // 判断当前是否是事件绑定
    const eventName = isEventName(key);
    if(eventName) {
        el.addEventListener(eventName, value);
    }else {
        el.setAttribute(key, value);
    }
}

function insert(el: any, parent:any) {
    parent.append(el);
}

const render = createRender({
    createElement,
    patchProp,
    insert
})

export function createApp(...args: any) {
    return render.createApp(args[0]);
}

export * from "../runtime-core/index";
