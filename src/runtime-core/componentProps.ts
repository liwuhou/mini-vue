import { Component } from "./types/index";

/**
 * 初始化props参数对象
 * @param instance 
 * @param props 
 */
 export function initProps(instance: Component, rawProps: any) {
    instance.props = rawProps || {};
}
