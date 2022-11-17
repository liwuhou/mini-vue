// 自定义渲染器
function createElement(tag) {
    return document.createElement(tag)
}

function createTextNode(text) {
    return document.createTextNode(text)
}

function patchProps(el, key, preValue, nextValue) {
    el.setAttribute(key, nextValue)
}

function insert(el, container) {
    container.append(el)
}

export function mountElement(vnode, container) {
    const { tag, props, children } = vnode

    // 创建的动作交由专门的渲染器去创建，以达到跨平台的效果
    const element = createElement(tag)

    // 设置属性
    for (const key of Reflect.ownKeys(props)) {
        patchProps(element, key, null, Reflect.get(props, key))
    }

    // 处理children
    if (typeof children === 'string') {
        insert(createTextNode(children), element)
    } else if (Array.isArray(children)) {
        children.forEach((child) => mountElement(child, element))
    }

    insert(element, container)
}