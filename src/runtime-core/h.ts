import { createVNode } from "./vnode";

/**
 * 提供页面使用的创建节点方法
 * @param type 
 * @param props 
 * @param children 
 */
export function h(type: any, props?: object, children?: string | Array<any>) {
    return createVNode(type, props, children);
}