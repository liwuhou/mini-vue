import { isEventName } from "../shared/index";
import { ShapeFlags } from "../shared/shapeFlags";
import { createComponentInstance, setupComponent } from "./component";
import { createAppAPI } from "./createApp";
import { Component, Vnode } from "./types/index";
import { Fragment, TextNode } from "./vnode";

export function createRender(options: any) {
    const { createElement, patchProp, insert } = options;

    /**
     * 根据虚拟节点渲染视图
     * @param vnode 虚拟节点
     * @param container 容器
     */
    function render(vnode: Vnode, container: any){
        patch(vnode, container, null);
    }

    /**
     * 处理渲染的核心方法
     * @param vnode 虚拟节点
     * @param container 容器
     */
    function patch(vnode: Vnode, container: any, parentComponent:Component | null) {
        const { shapeFlag, type } = vnode;
        switch(type) {
            case Fragment:
                // 仅渲染children元素
                processFragment(vnode, container, parentComponent);
                break;
            case TextNode:
                // 仅渲染children元素
                processText(vnode, container);
                break;
            default:
                // 1、处理element类型
                if(shapeFlag & ShapeFlags.ELEMENT) {
                    processElement(vnode, container, parentComponent);
                }else if(shapeFlag & ShapeFlags.STATEFUL_COMPONENT){
                    // 2、处理组件类型
                    processComponent(vnode, container, parentComponent);
                }
                break;
        }
    }

    /**
     * 处理组件渲染
     * @param vnode 
     * @param container 
     */
    function processComponent(vnode: Vnode, container: any, parentComponent:Component | null) {
        // 1、挂载组件
        mountComponent(vnode, container, parentComponent);
    }

    /**
     * 处理组件挂载
     * @param initialVnode 初始化节点
     * @param container 
     */
    function mountComponent(initialVnode: Vnode, container: any, parentComponent:Component | null) {
        // 1、创建组件实例
        const instance = createComponentInstance(initialVnode, parentComponent);
        // 2、设置组件相关配置
        setupComponent(instance);
        // 3、处理组件渲染
        setupRenderEffect(instance, initialVnode, container, parentComponent);
    }

    /**
     * 处理组件渲染
     * @param instance 组件实例
     * @param initialVnode 初始化节点
     * @param container 
     */
    function setupRenderEffect(instance: Component, initialVnode: Vnode, container: any, parentComponent:Component | null) {
        // 获取代理对象，并进行绑定
        const { proxy } = instance;
        // 1、获取子节点
        const subTree = instance.render.call(proxy);
        // 2、 渲染子节点
        patch(subTree, container, instance);
        // 3、所有节点都渲染完成后，绑定下el属性
        initialVnode.el = subTree.el;
    }

    /**
     * 处理元素渲染
     * @param vnode 虚拟节点
     * @param container 
     */
    function processElement(vnode: Vnode, container: any, parentComponent:Component | null) {
        mountElement(vnode, container, parentComponent);
    }

    /**
     * 处理元素挂载
     * @param vnode 
     * @param container 
     */
    function mountElement(vnode: Vnode, container: any, parentComponent:Component | null) {
        const element = createElementByVnode(vnode, container, parentComponent)
    }

    /**
     * 通过虚拟节点创建真实元素节点
     * @param vnode 虚拟节点
     * @param container 容器
     */
    function createElementByVnode(vnode: Vnode, container: any, parentComponent:Component | null) {
        const { type, children, props, shapeFlag } = vnode;
        
        // 1、创建元素
        const el = createElement(type);
        // 绑定元素节点
        vnode.el = el;

        // 2、处理子节点
        if(shapeFlag & ShapeFlags.TEXT_CHILDREN) {
            // 如果是字符串类型，直接赋值
            el.textContent = children
        }else if(shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
            // 如果是数组类型，需循环处理
            mountChildren(children, el, parentComponent);
        }

        // 3、处理props
        for (const key in props) {
            const val = props[key];
            
            patchProp(el, key, val);
        }
        insert(el, container);
    }


    /**
     * 挂载children
     * @param children 
     * @param container 
     */
    function mountChildren(children:Array<any>, container: any, parentComponent:Component | null) {
        children.forEach(v=>{
            patch(v, container,parentComponent);
        })
    }

    /**
     * 仅渲染children
     * @param vnode 
     * @param container 
     */
    function processFragment(vnode: Vnode, container: any, parentComponent:Component | null) {
        mountChildren(vnode.children, container, parentComponent);
    }

    /**
     * 渲染文本节点
     * @param vnode 
     * @param container 
     */
    function processText(vnode: Vnode, container: any) {
        const { children } = vnode;
        // 1、创建文本节点
        const textNode = document.createTextNode(children);
        vnode.el =textNode;

        // 2、渲染到容器
        container.append(textNode);
    }

    return {
        createApp: createAppAPI(render)
    }
}
