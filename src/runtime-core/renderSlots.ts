import { createVNode, Fragment } from "./vnode";

/**
 * 渲染slots
 * @param slots 
 * @param string 
 * @returns 
 */
export function renderSlots(slots: object, name: string, props: object) {
    // 获取对应的插槽
    const slot = slots[name];
    if(slot) {
        if(typeof slot === "function"){
            return createVNode(Fragment,{},slot(props));
        }
    }
}
