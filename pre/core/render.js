// renderer
function createElement(tag) {
    return document.createElement(tag)
}

function createTextNode(text) {
    return document.createTextNode(text)
}

function patchProps(el, key, preValue, nextValue) {
    if (nextValue !== null) {
        el.setAttribute(key, nextValue)
    } else {
        el.removeAttribute(key)
    }
}

function insert(el, container) {
    container.append(el)
}

function remove(child, parent) {
    parent.removeChild(child)
}

export function mountElement(vnode, container) {
    const { tag, props, children } = vnode

    // renderer make any device's element
    const element = (vnode.el = createElement(tag))

    // set any element's attribute
    for (const key of Reflect.ownKeys(props)) {
        patchProps(element, key, null, Reflect.get(props, key))
    }

    // handle node's child or children
    if (typeof children === 'string') {
        insert(createTextNode(children), element)
    } else if (Array.isArray(children)) {
        children.forEach((child) => mountElement(child, element))
    }

    insert(element, container)
}

export function diff(n1, n2) {
    // 1. diff tag
    const el = n2.el = n1.el
    if (n1.tag !== n2.tag) {
        n1.el.replaceWith(createElement(n2.tag))
    } else {
        // 2. diff props
        const { props: newProps } = n2
        const { props: oldProps } = n1
        if (newProps) {
            // add: oldProps need add some attributes in newProps
            for (const key of Reflect.ownKeys(newProps)) {
                if (newProps[key] !== oldProps[key]) {
                    patchProps(el, key, oldProps[key], newProps[key])
                }
            }
        }
        // remove: newProps need remove some attributes diff from oldProps
        if (oldProps) {
            for (const key in oldProps) {
                if (!Reflect.has(newProps, key)) {
                    patchProps(el, key, oldProps[key], null)

                }
            }
        }

        // 3. diff children
        const newChildren = n2.children
        const oldChildren = n1.children
        // 1. newChildren is string type and oldChildren is a string type or array type
        if (typeof newChildren === 'string') {
            el.innerText = n2.children
        } else if (typeof oldChildren === 'string') {
            // 2. newChildren is a array type data and oldChildren is a string type data
            el.innerText = ''
            newChildren.forEach((child) => mountElement(child, el))
        } else {
            // 3. newChildren and oldChildren both is a array type data
            // force replace new children
            // ignore add, remove and replace

            const minLength = Math.min(newChildren.length, oldChildren.length)
            for (let i = 0; i < minLength; i++) {
                const newChild = newChildren[i]
                const oldChild = oldChildren[i]
                diff(oldChild, newChild)
            }
            // newChildren length > oldChildren => append child to newChildren
            if (newChildren.length > minLength) {
                for (let i = minLength; i < newChildren.length; i++) {
                    mountElement(newChildren[i], el)
                }
            }

            // oldChildren length > newChildfren => remove child to newChildren
            if (oldChildren.length > length) {
                for (let i = minLength; i < oldChildren.length; i++) {
                    remove(oldChildren[i].el, el)
                }
            }
        }
    }
}