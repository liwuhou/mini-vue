import { createVNode } from "./vnode";

export function createAppAPI(render) {
    /**
     * 创建APP实例
     * @param rootComponent 根组件return
     * @returns 
     */
    return function createApp(rootComponent: object) {
        return {
            mount(rootContainer:any) {
                // 1、先将组件转换为虚拟节点（vnode），后续操作都将基于虚拟节点进行操作
                const vnode = createVNode(rootComponent);

                // 2、拿到虚拟节点后，开始进行实际渲染
                render(vnode, rootContainer);
            }
        }
    }
}
