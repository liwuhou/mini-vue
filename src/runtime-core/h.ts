import { createVNode } from "./vnode"
import type { CreateVNode } from "./vnode"

export type H = CreateVNode
export const h: H = (type, props, children) => createVNode(type, props, children)
