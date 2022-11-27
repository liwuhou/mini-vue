import { ShapeFlags } from "../shared/shapeFlags";
import { Vnode } from "./types/index";

export const Fragment = Symbol("Fragment");
export const TextNode = Symbol("Text")

/**
 * 创建虚拟节点
 * @param type 虚拟节点类型
 * @param props 参数值
 * @param children 子元素
 * @returns 
 */
export function createVNode(type: any, props?: object, children?: any) {
    const vnode: Vnode = {
        type,
        props,
        children,
        shapeFlag: getShapeFlag(type),
        el:null,
    }

    if(typeof children === "string") {
        // 如果是字符串类型
        vnode.shapeFlag |= ShapeFlags.TEXT_CHILDREN; 
    }else if(Array.isArray(children)) {
        // 如果是数组类型
        vnode.shapeFlag |= ShapeFlags.ARRAY_CHILDREN; 
    }

    // 如果是组件类型&children是对象类型，则当作插槽处理
    if(vnode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
        if(typeof children === "object") {
            vnode.shapeFlag |= ShapeFlags.SLOT_CHILDREN;
        }
    }

    return vnode;
}

export function createTextVNode(text: string) {
    return createVNode(TextNode, {}, text);
}   


/**
 * 获取渲染节点类型
 * @param type 
 * @returns 
 */
function getShapeFlag(type: any) {
    // 如果是字符串，则返回element类型，否则返回组件类型
    return typeof type === "string" ? ShapeFlags.ELEMENT : ShapeFlags.STATEFUL_COMPONENT;
}
