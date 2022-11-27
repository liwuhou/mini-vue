/**
 * 渲染类型
 * 可以运用位运算符来进行类型判断 
 * 位运算符比对象形式执行查找更高效
 * ELEMENT = 00001
 * STATEFUL_COMPONENT = 00010
 * TEXT_CHILDREN = 00100
 * ARRAY_CHILDREN = 01000
 */
 export const enum ShapeFlags {
    // 最后渲染的element类型
    ELEMENT = 1,  // 01
    // 组件类型
    STATEFUL_COMPONENT = 1 << 1,
    // 虚拟节点的children为string类型
    TEXT_CHILDREN = 1 << 2,
    // 虚拟节点的children为array类型
    ARRAY_CHILDREN = 1 << 3,
    // 虚拟节点的children为SLOT类型
    SLOT_CHILDREN = 1 << 4,
}